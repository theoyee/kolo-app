import { Inter, Fraunces } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

// Primary UI Font: Variable, optimized, and safe for ₦ and tabular numbers
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT', 'WONK'],
});

export const metadata: Metadata = {
  title: "Kolo — Run your business. Know your numbers.",
  description: "The operating system for modern African businesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Injecting the CSS variables into the HTML tag
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} antialiased`}
    >
      {/* font-sans applies Inter globally as the default */}
      <body className="font-inter bg-gray-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
