'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { InputField } from '../ui/InputField';
import { authApi, businessApi, saveAuthSession } from '@/lib/api';

const FIELDS = [
  { key: 'name', label: 'Full name', type: 'text', placeholder: 'Ada Okafor' },
  { key: 'email', label: 'Business email', type: 'email', placeholder: 'you@business.com' },
  { key: 'phone', label: 'Phone number', type: 'tel', placeholder: '0803 123 4567' },
  { key: 'businessName', label: 'Business name', type: 'text', placeholder: 'Olagoke Fashion' },
  { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
] as const;

type FieldKey = (typeof FIELDS)[number]['key'];

function validate(key: FieldKey, value: string) {
  if (!value.trim()) return 'Required';
  if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email';
  if (key === 'phone' && value.replace(/\D/g, '').length < 10) return 'Enter a valid Nigerian phone number';
  if (key === 'password' && value.length < 8) return 'Use at least 8 characters';
  return '';
}

export default function SignupPage() {
  const router = useRouter();
  const [values, setValues] = useState<Record<FieldKey, string>>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    password: '',
  });
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [signupError, setSignupError] = useState('');

  const errors = Object.fromEntries(FIELDS.map((f) => [f.key, validate(f.key, values[f.key])])) as Record<FieldKey, string>;
  const isValid = Object.values(errors).every((e) => !e);

  const passwordStrength = Math.min(
    4,
    [values.password.length >= 8, /[A-Z]/.test(values.password), /[0-9]/.test(values.password), /[^A-Za-z0-9]/.test(values.password)].filter(Boolean).length
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, businessName: true, password: true });
    setSignupError('');
    if (!isValid) return;
    setSubmitting(true);

    try {
      const parts = values.name.trim().split(' ');
      const firstName = parts[0] || 'User';
      const lastName = parts.slice(1).join(' ') || firstName;
      const cleanPhone = values.phone.replace(/\s+/g, '');
      const businessName = values.businessName.trim() || `${firstName}'s Enterprise`;

      const res = await authApi.register({
        firstName,
        lastName,
        email: values.email.trim(),
        phone: cleanPhone,
        password: values.password,
        businessName,
        businessType: 'RETAIL',
      });

      if (!res.success || !res.data) {
        const errorMsg = res.error?.message || 'Failed to create account. Please check your details.';
        setSignupError(errorMsg);
        toast.error(errorMsg);
        setSubmitting(false);
        return;
      }

      const { tokens, user, business } = res.data;
      let businessId = business?.id || user?.memberships?.[0]?.businessId;

      // Save tokens first so subsequent business API calls authenticate properly
      saveAuthSession(tokens.accessToken, tokens.refreshToken, businessId, user);

      // If backend created user without immediate business record, provision it now
      if (!businessId) {
        try {
          const bizRes = await businessApi.create({
            name: businessName,
            currency: 'NGN',
            businessType: 'RETAIL',
          });
          if (bizRes.success && bizRes.data?.id) {
            businessId = bizRes.data.id;
            saveAuthSession(tokens.accessToken, tokens.refreshToken, businessId, user);
          }
        } catch {
          // ignore
        }
      }

      toast.success('Account created successfully! Welcome to Kolo.');
      router.push('/dashboard');
    } catch (err: any) {
      const errorMsg = err?.message || 'An error occurred while creating your account.';
      setSignupError(errorMsg);
      toast.error(errorMsg);
      setSubmitting(false);
    }
  };

  return (
    <div className='space-y-4 md:space-y-6'>
      <div className="mb-8">
        <h1 className="text-[27px] font-bold m-0 mb-2 text-kolo-ink">Create your business</h1>
        <p className="text-kolo-muted text-[15px]">Set up takes about two minutes. No card required.</p>
      </div>

      {signupError && (
        <div
          className="mb-4 rounded-md border border-kolo-stamp/25 bg-kolo-stamp/5 px-3 py-[10px] text-[13px] text-kolo-stamp"
          role="alert"
        >
          {signupError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className='space-y-4'>
        {FIELDS.map((field) => (
          <InputField
            key={field.key}
            id={field.key}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            value={values[field.key]}
            error={touched[field.key] && errors[field.key]}
            passwordStrength={field.key === 'password' ? passwordStrength : undefined}
            onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, [field.key]: true }))}
          />
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="group w-full flex items-center justify-center gap-2 bg-[#1B2A22] hover:bg-[#0F1811] text-white rounded-[9px] py-[11px] font-bold hover:opacity-90 active:scale-[0.99] transition disabled:opacity-70 mt-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-kolo-muted border-t border-[#1B2A22]/10 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-kolo-currency hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
