"use client";

import { Shield, Clock, CheckCircle } from 'lucide-react';
import { Tooltip } from '~/components/ui/tooltip';

interface ComplianceBadgeProps {
  status: 'eligible' | 'processing' | 'approved' | 'not-eligible';
  daysRemaining?: number;
  className?: string;
}

export function ComplianceBadge({ status, daysRemaining, className = '' }: ComplianceBadgeProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'eligible':
        return {
          icon: <Shield className="w-4 h-4" />,
          label: 'GTS Eligible',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          tooltip: 'This job is eligible for the Global Talent Stream fast track'
        };
      case 'processing':
        return {
          icon: <Clock className="w-4 h-4" />,
          label: `GTS Processing (${daysRemaining} days)`,
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          tooltip: `GTS work permit in process - ${daysRemaining} days remaining on 14-day timeline`
        };
      case 'approved':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'GTS Approved',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          tooltip: 'Work permit approved through Global Talent Stream fast track'
        };
      case 'not-eligible':
        return {
          icon: <Shield className="w-4 h-4" />,
          label: 'Not GTS Eligible',
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          tooltip: 'This job does not qualify for Global Talent Stream'
        };
      default:
        return {
          icon: <Shield className="w-4 h-4" />,
          label: 'GTS Status',
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          tooltip: 'Global Talent Stream status'
        };
    }
  };

  const { icon, label, color, tooltip } = getStatusInfo();

  return (
    <Tooltip content={tooltip}>
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${color} ${className}`}>
        {icon}
        <span>{label}</span>
      </div>
    </Tooltip>
  );
}