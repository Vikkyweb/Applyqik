'use client';

import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
};

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
