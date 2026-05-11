import React, { useId } from 'react';
import { clsx } from 'clsx';

// ── Types ─────────────────────────────────────────────────────────────────

export interface AppInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Wrappper className */
  wrapperClassName?: string;
}

// ── Component ─────────────────────────────────────────────────────────────

/**
 * AppInput — input dùng chung với label, error và icon slot.
 *
 * @example
 * <AppInput label="Email" type="email" leftIcon={<Mail size={16} />}
 *   error={errors.email} placeholder="you@example.com" />
 */
export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  wrapperClassName,
  id,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={clsx('flex flex-col gap-1.5', wrapperClassName)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-app-text"
        >
          {label}
          {rest.required && (
            <span className="ml-1 text-status-error" aria-hidden>*</span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 flex items-center text-app-muted pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          className={clsx(
            // Base
            'w-full h-11 rounded-app border bg-app-surface text-app-text text-sm',
            'placeholder:text-app-muted/60',
            'transition-colors duration-150',
            // Focus
            'outline-none',
            'focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green',
            // Error
            error
              ? 'border-status-error focus:ring-status-error/30 focus:border-status-error'
              : 'border-app-border',
            // Icon padding
            leftIcon ? 'pl-10' : 'pl-3.5',
            rightIcon ? 'pr-10' : 'pr-3.5',
            // Disabled
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-app-bg',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...rest}
        />

        {rightIcon && (
          <span className="absolute right-3 flex items-center text-app-muted">
            {rightIcon}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-status-error font-medium flex items-center gap-1">
          <span aria-hidden>⚠</span> {error}
        </p>
      )}

      {/* Helper text */}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-xs text-app-muted">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default AppInput;
