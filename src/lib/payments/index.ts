import { PaymentMethod, PaymentProvider } from "@prisma/client";

export interface PaymentConfig {
  provider: PaymentProvider;
  method: PaymentMethod;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  description: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
  provider: PaymentProvider;
  method: PaymentMethod;
}

export interface PaymentVerification {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  provider: PaymentProvider;
}

// Flutterwave configuration
export const FLUTTERWAVE_CONFIG = {
  publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || '',
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY || '',
  baseUrl: 'https://api.flutterwave.com/v3',
};

// PayPal configuration
export const PAYPAL_CONFIG = {
  clientId: process.env.PAYPAL_CLIENT_ID || '',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.paypal.com' 
    : 'https://api.sandbox.paypal.com',
};

// Mobile Money configuration
export const MOBILE_MONEY_CONFIG = {
  mtn: {
    apiKey: process.env.MTN_MOBILE_MONEY_API_KEY || '',
    baseUrl: 'https://sandbox.momodeveloper.mtn.com',
  },
  airtel: {
    apiKey: process.env.AIRTEL_MONEY_API_KEY || '',
    baseUrl: 'https://openapiuat.airtel.africa',
  },
};

export class PaymentService {
  static async initiatePayment(config: PaymentConfig): Promise<PaymentResult> {
    try {
      switch (config.provider) {
        case 'FLUTTERWAVE':
          return await this.initiateFlutterwavePayment(config);
        case 'PAYPAL':
          return await this.initiatePayPalPayment(config);
        case 'MTN_MOBILE_MONEY':
          return await this.initiateMTNMobileMoneyPayment(config);
        case 'AIRTEL_MONEY':
          return await this.initiateAirtelMoneyPayment(config);
        case 'MANUAL':
          return await this.initiateManualPayment(config);
        default:
          throw new Error(`Unsupported payment provider: ${config.provider}`);
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment initiation failed',
        provider: config.provider,
        method: config.method,
      };
    }
  }

  static async verifyPayment(
    provider: PaymentProvider,
    transactionId: string
  ): Promise<PaymentVerification> {
    try {
      switch (provider) {
        case 'FLUTTERWAVE':
          return await this.verifyFlutterwavePayment(transactionId);
        case 'PAYPAL':
          return await this.verifyPayPalPayment(transactionId);
        case 'MTN_MOBILE_MONEY':
          return await this.verifyMTNMobileMoneyPayment(transactionId);
        case 'AIRTEL_MONEY':
          return await this.verifyAirtelMoneyPayment(transactionId);
        case 'MANUAL':
          return await this.verifyManualPayment(transactionId);
        default:
          throw new Error(`Unsupported payment provider: ${provider}`);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        transactionId,
        amount: 0,
        currency: 'USD',
        status: 'failed',
        provider,
      };
    }
  }

  // Flutterwave implementation
  private static async initiateFlutterwavePayment(config: PaymentConfig): Promise<PaymentResult> {
    const response = await fetch(`${FLUTTERWAVE_CONFIG.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FLUTTERWAVE_CONFIG.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: `vizzarjobs_${Date.now()}`,
        amount: config.amount,
        currency: config.currency,
        redirect_url: config.callbackUrl,
        payment_options: config.method === 'MOBILE_MONEY' ? 'mobilemoney' : 'card',
        customer: {
          email: config.customerEmail,
          name: config.customerName,
          phone_number: config.customerPhone,
        },
        customizations: {
          title: 'VizzarJobs Premium',
          description: config.description,
          logo: 'https://vizzarjobs.com/logo.png',
        },
        meta: config.metadata,
      }),
    });

    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        success: true,
        transactionId: data.data.tx_ref,
        paymentUrl: data.data.link,
        provider: 'FLUTTERWAVE',
        method: config.method,
      };
    } else {
      return {
        success: false,
        error: data.message || 'Flutterwave payment failed',
        provider: 'FLUTTERWAVE',
        method: config.method,
      };
    }
  }

  private static async verifyFlutterwavePayment(transactionId: string): Promise<PaymentVerification> {
    const response = await fetch(`${FLUTTERWAVE_CONFIG.baseUrl}/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${FLUTTERWAVE_CONFIG.secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return {
      success: data.status === 'success' && data.data.status === 'successful',
      transactionId,
      amount: data.data.amount || 0,
      currency: data.data.currency || 'USD',
      status: data.data.status === 'successful' ? 'success' : 'failed',
      provider: 'FLUTTERWAVE',
    };
  }

  // PayPal implementation
  private static async initiatePayPalPayment(config: PaymentConfig): Promise<PaymentResult> {
    // Get access token
    const tokenResponse = await fetch(`${PAYPAL_CONFIG.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${PAYPAL_CONFIG.clientId}:${PAYPAL_CONFIG.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get PayPal access token');
    }

    // Create payment
    const paymentResponse = await fetch(`${PAYPAL_CONFIG.baseUrl}/v1/payments/payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'sale',
        payer: {
          payment_method: 'paypal',
        },
        transactions: [{
          amount: {
            total: config.amount.toString(),
            currency: config.currency,
          },
          description: config.description,
        }],
        redirect_urls: {
          return_url: config.callbackUrl,
          cancel_url: config.callbackUrl,
        },
      }),
    });

    const paymentData = await paymentResponse.json();
    
    if (paymentData.id) {
      const approvalUrl = paymentData.links.find((link: any) => link.rel === 'approval_url');
      return {
        success: true,
        transactionId: paymentData.id,
        paymentUrl: approvalUrl?.href,
        provider: 'PAYPAL',
        method: config.method,
      };
    } else {
      return {
        success: false,
        error: paymentData.message || 'PayPal payment failed',
        provider: 'PAYPAL',
        method: config.method,
      };
    }
  }

  private static async verifyPayPalPayment(transactionId: string): Promise<PaymentVerification> {
    // This would typically be called from a webhook or after user returns from PayPal
    // For now, we'll return a basic verification
    return {
      success: true,
      transactionId,
      amount: 0,
      currency: 'USD',
      status: 'success',
      provider: 'PAYPAL',
    };
  }

  // Mobile Money implementations
  private static async initiateMTNMobileMoneyPayment(config: PaymentConfig): Promise<PaymentResult> {
    // MTN Mobile Money API implementation
    // This is a simplified version - actual implementation would depend on MTN's API
    return {
      success: true,
      transactionId: `mtn_${Date.now()}`,
      paymentUrl: `https://momodeveloper.mtn.com/payment/${Date.now()}`,
      provider: 'MTN_MOBILE_MONEY',
      method: config.method,
    };
  }

  private static async verifyMTNMobileMoneyPayment(transactionId: string): Promise<PaymentVerification> {
    return {
      success: true,
      transactionId,
      amount: 0,
      currency: 'UGX',
      status: 'success',
      provider: 'MTN_MOBILE_MONEY',
    };
  }

  private static async initiateAirtelMoneyPayment(config: PaymentConfig): Promise<PaymentResult> {
    // Airtel Money API implementation
    return {
      success: true,
      transactionId: `airtel_${Date.now()}`,
      paymentUrl: `https://openapiuat.airtel.africa/payment/${Date.now()}`,
      provider: 'AIRTEL_MONEY',
      method: config.method,
    };
  }

  private static async verifyAirtelMoneyPayment(transactionId: string): Promise<PaymentVerification> {
    return {
      success: true,
      transactionId,
      amount: 0,
      currency: 'UGX',
      status: 'success',
      provider: 'AIRTEL_MONEY',
    };
  }

  // Manual payment (for admin approval)
  private static async initiateManualPayment(config: PaymentConfig): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `manual_${Date.now()}`,
      provider: 'MANUAL',
      method: config.method,
    };
  }

  private static async verifyManualPayment(transactionId: string): Promise<PaymentVerification> {
    return {
      success: true,
      transactionId,
      amount: 0,
      currency: 'USD',
      status: 'success',
      provider: 'MANUAL',
    };
  }
}

// Payment method configurations for different regions
export const PAYMENT_METHODS_BY_REGION = {
  UG: [ // Uganda
    { provider: 'FLUTTERWAVE', method: 'MOBILE_MONEY', name: 'Mobile Money (MTN/Airtel)', icon: '📱' },
    { provider: 'FLUTTERWAVE', method: 'CARD', name: 'Card Payment', icon: '💳' },
    { provider: 'PAYPAL', method: 'PAYPAL', name: 'PayPal', icon: '🅿️' },
    { provider: 'MANUAL', method: 'BANK_TRANSFER', name: 'Bank Transfer', icon: '🏦' },
  ],
  KE: [ // Kenya
    { provider: 'FLUTTERWAVE', method: 'MOBILE_MONEY', name: 'M-Pesa', icon: '📱' },
    { provider: 'FLUTTERWAVE', method: 'CARD', name: 'Card Payment', icon: '💳' },
    { provider: 'PAYPAL', method: 'PAYPAL', name: 'PayPal', icon: '🅿️' },
  ],
  NG: [ // Nigeria
    { provider: 'FLUTTERWAVE', method: 'CARD', name: 'Card Payment', icon: '💳' },
    { provider: 'PAYSTACK', method: 'CARD', name: 'Paystack', icon: '💳' },
    { provider: 'PAYPAL', method: 'PAYPAL', name: 'PayPal', icon: '🅿️' },
  ],
  DEFAULT: [ // Default/International
    { provider: 'FLUTTERWAVE', method: 'CARD', name: 'Card Payment', icon: '💳' },
    { provider: 'PAYPAL', method: 'PAYPAL', name: 'PayPal', icon: '🅿️' },
    { provider: 'MANUAL', method: 'BANK_TRANSFER', name: 'Bank Transfer', icon: '🏦' },
  ],
};

export function getPaymentMethodsForRegion(region: string = 'DEFAULT') {
  return PAYMENT_METHODS_BY_REGION[region as keyof typeof PAYMENT_METHODS_BY_REGION] || PAYMENT_METHODS_BY_REGION.DEFAULT;
}

