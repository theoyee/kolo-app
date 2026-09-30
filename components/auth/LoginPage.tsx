'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { InputField } from '../ui/InputField';
import { authApi, saveAuthSession, businessApi } from '@/lib/api';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setAuthError('');
    if (!isValid) return;
    setSubmitting(true);

    try {
      const res = await authApi.login({
        email: values.email.trim(),
        password: values.password,
      });

      if (!res.success || !res.data) {
        const errorMsg = res.error?.message || 'Login failed. Please check your credentials.';
        setAuthError(errorMsg);
        toast.error(errorMsg);
        setSubmitting(false);
        return;
      }

      const { tokens, user, business } = res.data;
      let businessId = business?.id;

      // Extract active business ID from user memberships or query businesses
      if (!businessId && user?.memberships && user.memberships.length > 0) {
        businessId = user.memberships[0].businessId || user.memberships[0].business?.id;
      }

      if (!businessId) {
        saveAuthSession(tokens.accessToken, tokens.refreshToken, undefined, user);
        const bizRes = await businessApi.list();
        if (bizRes.success && Array.isArray(bizRes.data) && bizRes.data.length > 0) {
          businessId = bizRes.data[0].id;
        }
      }

      saveAuthSession(tokens.accessToken, tokens.refreshToken, businessId, user);
      toast.success(`Welcome back${user?.firstName ? `, ${user.firstName}` : ''}!`);
      router.push('/dashboard');
    } catch (err: any) {
      const errorMsg = err?.message || 'An unexpected error occurred during login.';
      setAuthError(errorMsg);
      toast.error(errorMsg);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-8">
        <h1 className="text-[27px] font-bold m-0 mb-2 text-kolo-ink">Log in to Kolo</h1>
        <p className="text-kolo-muted text-[15px]">
          Enter your details to access your dashboard.
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
        {FIELDS.map((field) => (
          <InputField
            key={field.key}
            id={field.key}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            value={values[field.key]}
            error={touched[field.key] && errors[field.key]}
            onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, [field.key]: true }))}
          />
        ))}

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-[#1B2A22]/20 text-[#1B2A22] focus:ring-kolo-currency accent-[#1B2A22]"
            />
            <span className="text-kolo-muted font-medium">Keep me signed in</span>
          </label>
          <button
            type="button"
            onClick={() => toast.info('Password reset link will be sent to your email.')}
            className="text-kolo-muted hover:text-kolo-ink font-medium"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-[#1B2A22] hover:bg-[#0F1811] text-white rounded-[9px] py-[11px] font-bold hover:opacity-90 active:scale-[0.99] transition disabled:opacity-70 mt-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Log in'
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-kolo-muted border-t border-[#1B2A22]/10 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-kolo-currency hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
