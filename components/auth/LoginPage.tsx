'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { InputField } from '../ui/InputField';

const FIELDS = [
  { key: 'email', label: 'Business email', type: 'email', placeholder: 'you@business.com' },
  { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
] as const;

type FieldKey = (typeof FIELDS)[number]['key'];

function validate(key: FieldKey, value: string) {
  if (!value.trim()) return 'Required';
  if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email';
  return '';
}

export default function LoginPage() {
  const router = useRouter();
  const [values, setValues] = useState<Record<FieldKey, string>>({ email: '', password: '' });
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const errors = Object.fromEntries(
    FIELDS.map((f) => [f.key, validate(f.key, values[f.key])])
  ) as Record<FieldKey, string>;
  const isValid = Object.values(errors).every((e) => !e);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setAuthError('');
    if (!isValid) return;
    setSubmitting(true);
    // TODO: replace with real login call; on failure, setAuthError(message)
    setTimeout(() => {
      setSubmitting(false);
      router.push('/dashboard');
    }, 900);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-8">
        <h1 className="text-[27px] font-bold m-0 mb-2 text-kolo-ink">Log in to Kolo</h1>
        <p className="text-kolo-muted text-[15px]">
          Enter your details to get back to your dashboard.
        </p>
      </div>

      {authError && (
        <div
          className="mb-4 rounded-md border border-kolo-stamp/25 bg-kolo-stamp/5 px-3 py-[10px] text-[13px] text-kolo-stamp"
          role="alert"
        >
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {FIELDS.map((field) => {
          const error = touched[field.key] && errors[field.key];
          const isPassword = field.key === 'password';

          return (
            <React.Fragment key={field.key}>
              <InputField
                id={field.key}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.key]}
                error={error}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues((v) => ({ ...v, [field.key]: e.target.value }))
                }
                onBlur={() => setTouched((t) => ({ ...t, [field.key]: true }))}
              />

              {/* "Forgot password?" is injected right below the password field */}
              {isPassword && !error && (
                <div className="text-right -mt-3 mb-4 relative z-10">
                  <Link
                    href="/forgot-password"
                    className="text-[12px] font-semibold text-kolo-ink hover:underline underline-offset-2"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
            </React.Fragment>
          );
        })}

        <label className="flex items-center gap-2 mb-6 text-[13px] text-kolo-muted select-none cursor-pointer my-4">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-[15px] h-[15px] rounded-[4px] border-kolo-hairline text-kolo-ink focus:ring-kolo-ink accent-kolo-ink"
          />
          Keep me logged in on this device
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-kolo-ink hover:bg-kolo-ink-dark text-white rounded-lg py-[11px] font-bold active:scale-[0.99] transition-all disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in
            </>
          ) : (
            'Log in'
          )}
        </button>
      </form>

      <p className="text-center text-kolo-muted mt-5 text-sm">
        Don{`'`}t have an account?{' '}
        <Link
          href="/signup"
          className="ml-2 text-kolo-ink hover:text-kolo-currency font-bold hover:underline underline-offset-2"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}