# Payment Setup Guide for Uganda

This guide explains how to set up payment processing for VizzarJobs in Uganda and other African countries.

## Supported Payment Methods

### 1. Flutterwave (Recommended for Uganda)
Flutterwave is the most comprehensive payment solution for Africa, supporting:
- Mobile Money (MTN, Airtel)
- Card payments
- Bank transfers
- Multiple currencies

**Setup Steps:**
1. Sign up at [Flutterwave](https://flutterwave.com)
2. Get your API keys from the dashboard
3. Add to environment variables:
   ```
   FLUTTERWAVE_PUBLIC_KEY=your-public-key
   FLUTTERWAVE_SECRET_KEY=your-secret-key
   ```

### 2. PayPal
PayPal works in Uganda but with some restrictions.

**Setup Steps:**
1. Create a PayPal Developer account
2. Create an app and get credentials
3. Add to environment variables:
   ```
   PAYPAL_CLIENT_ID=your-client-id
   PAYPAL_CLIENT_SECRET=your-client-secret
   ```

### 3. Mobile Money (Direct Integration)
For direct mobile money integration with MTN and Airtel.

**Setup Steps:**
1. Contact MTN/Airtel for API access
2. Add API keys to environment variables:
   ```
   MTN_MOBILE_MONEY_API_KEY=your-mtn-key
   AIRTEL_MONEY_API_KEY=your-airtel-key
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="your-database-url"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Payment Providers
FLUTTERWAVE_PUBLIC_KEY="your-flutterwave-public-key"
FLUTTERWAVE_SECRET_KEY="your-flutterwave-secret-key"
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
```

## Payment Flow

1. **User selects subscription plan** → Pricing page
2. **User chooses payment method** → Payment method modal
3. **Payment initiated** → Redirect to payment provider
4. **Payment completed** → Callback to `/subscription/callback`
5. **Payment verified** → Subscription activated

## Testing

### Flutterwave Test Mode
- Use Flutterwave's test mode for development
- Test cards: 4187427415564246 (Visa), 5438898014560229 (Mastercard)
- Test mobile money numbers are provided in Flutterwave dashboard

### PayPal Sandbox
- Use PayPal sandbox for testing
- Create sandbox accounts for testing

## Production Deployment

1. **Switch to live API keys** for all payment providers
2. **Update callback URLs** to production domain
3. **Test all payment methods** thoroughly
4. **Set up webhooks** for payment notifications
5. **Monitor payment logs** for any issues

## Supported Countries

The payment system automatically detects user region and shows appropriate payment methods:

- **Uganda (UG)**: Mobile Money, Flutterwave, PayPal, Bank Transfer
- **Kenya (KE)**: M-Pesa, Flutterwave, PayPal
- **Nigeria (NG)**: Flutterwave, Paystack, PayPal
- **Default**: Flutterwave, PayPal, Bank Transfer

## Fees

- **Flutterwave**: 1.4% + $0.20 per transaction
- **PayPal**: 3.4% + fixed fee (varies by country)
- **Mobile Money**: Varies by provider (usually 0.5-2%)

## Security

- All payment data is handled securely
- No sensitive payment information is stored locally
- PCI DSS compliance through payment providers
- HTTPS required for all payment flows

## Support

For payment-related issues:
1. Check payment provider documentation
2. Review application logs
3. Contact payment provider support
4. Check VizzarJobs support channels

