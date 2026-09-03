'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { InputField } from '../ui/InputField';


const FIELDS = [
  { key: 'name', label: 'Full name', type: 'text', placeholder: 'Ada Okafor' },
  { key: 'email', label: 'Business email', type: 'email', placeholder: 'you@business.com' },
  { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
] as const;

type FieldKey = (typeof FIELDS)[number]['key'];

function validate(key: FieldKey, value: string) {
  if (!value.trim()) return 'Required';
  if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email';
  if (key === 'password' && value.length < 8) return 'Use at least 8 characters';
  return '';
}

export default function SignupPage() {
  const router = useRouter();
  const [values, setValues] = useState<Record<FieldKey, string>>({ name: '', email: '', password: '' });
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  const errors = Object.fromEntries(FIELDS.map((f) => [f.key, validate(f.key, values[f.key])])) as Record<FieldKey, string>;
  const isValid = Object.values(errors).every((e) => !e);

  const passwordStrength = Math.min(
    4,
    [values.password.length >= 8, /[A-Z]/.test(values.password), /[0-9]/.test(values.password), /[^A-Za-z0-9]/.test(values.password)].filter(Boolean).length
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (!isValid) return;
    setSubmitting(true);
    // TODO: replace with real signup call
    setTimeout(() => {
      setSubmitting(false);
      router.push('/onboarding');
    }, 900);
  };

  return (
    <div className='space-y-4 md:space-y-6'>
      <div className="mb-8">
        <h1 className="text-[27px] font-bold m-0 mb-2 text-kolo-ink">Create your business</h1>
        <p className="text-kolo-muted text-[15px]">Set up takes about two minutes. No card required.</p>
      </div>

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
            passwordStrength={passwordStrength}
            onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, [field.key]: true }))}
          />
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="group w-full flex items-center justify-center gap-2 bg-[#1B2A22] hover:bg-[#0F1811] text-white rounded-[9px] py-[11px] font-bold hover:opacity-90 active:scale-[0.99] transition disabled:opacity-70 mt-2"
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

      <p className="text-center text-[#6a7872] mt-5 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="ml-2 text-kolo-ink hover:text-[#2E6F4D] font-bold hover:underline underline-offset-2">
          Log in
        </Link>
      </p>

      <p className="text-center text-kolo-muted mt-8 text-[12px] leading-relaxed">
        By creating an account, you agree to Kolo{`'`}s Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}