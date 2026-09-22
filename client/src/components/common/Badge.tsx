import React from 'react';
import { VerdictType, RiskLevel, SourceCategory } from '../../types';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, ShieldAlert, ShieldCheck } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: VerdictType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, size = 'md', showIcon = true }) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5 font-medium',
    lg: 'text-base px-4 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 13,
    md: 16,
    lg: 20,
  };

  switch (verdict) {
    case 'Likely Reliable':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]}`}>
          {showIcon && <CheckCircle2 size={iconSizes[size]} className="text-emerald-500" />}
          <span>Likely Reliable</span>
        </span>
      );
    case 'Potentially Misleading':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 ${sizeClasses[size]}`}>
          {showIcon && <AlertTriangle size={iconSizes[size]} className="text-amber-500" />}
          <span>Potentially Misleading</span>
        </span>
      );
    case 'Likely False':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 ${sizeClasses[size]}`}>
          {showIcon && <XCircle size={iconSizes[size]} className="text-rose-500" />}
          <span>Likely False</span>
        </span>
      );
    case 'Requires Verification':
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 ${sizeClasses[size]}`}>
          {showIcon && <HelpCircle size={iconSizes[size]} className="text-blue-500" />}
          <span>Requires Verification</span>
        </span>
      );
  }
};

export const RiskBadge: React.FC<{ risk: RiskLevel }> = ({ risk }) => {
  const map: Record<RiskLevel, { bg: string; text: string; border: string }> = {
    Low: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
    Moderate: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
    High: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20' },
    Critical: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' },
  };

  const style = map[risk] || map.Moderate;

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md border font-medium ${style.bg} ${style.text} ${style.border}`}>
      {risk === 'Low' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
      Risk: {risk}
    </span>
  );
};

export const SourceCategoryBadge: React.FC<{ category: SourceCategory }> = ({ category }) => {
  switch (category) {
    case 'Supports Claim':
      return (
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
          Supports Claim
        </span>
      );
    case 'Contradicts Claim':
      return (
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-medium">
          Contradicts Claim
        </span>
      );
    case 'Provides Context':
    default:
      return (
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
          Provides Context
        </span>
      );
  }
};
