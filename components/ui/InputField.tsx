'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { koloColors } from '@/utils/constants';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | false;
  passwordStrength?: number;
}

export function InputField({
  label,
  error,
  type = 'text',
  passwordStrength = 0,
  onFocus,
  onBlur,
  ...props
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between mb-[7px]">
        <label htmlFor={props.id} className="block text-[12px] font-semibold text-kolo-ink">
          {label}
        </label>
        {error && (
          <span className="text-[12px] font-medium text-kolo-stamp" role="alert">
            {error}
          </span>
        )}
      </div>
      <div
        className={[
          'relative flex items-center border-0 border-b bg-transparent transition-colors',
          error ? 'border-kolo-stamp' : isFocused ? 'border-kolo-ink' : 'border-kolo-hairline',
          // was `isPassword && props.value && 'border-b-0'` — when falsy that
          // evaluated to the boolean `false`, and Array.join stringifies it
          // to the literal text "false", injecting a bogus class name.
          isPassword && props.value ? 'border-b-0' : '',
        ].join(' ')}
      >
        <input
          type={inputType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full bg-transparent px-3 py-[11px] outline-none text-kolo-ink placeholder:text-kolo-placeholder"
          aria-invalid={!!error}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="pr-3 text-kolo-muted-light hover:text-kolo-ink transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {isPassword && props.value && (
        <div className="flex gap-1 mt-2" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-[3px] flex-1 rounded-full transition-colors duration-300"
              style={{
                backgroundColor:
                  i < passwordStrength
                    ? passwordStrength >= 3
                      ? koloColors.currency
                      : koloColors.stamp
                    : koloColors.hairline,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}