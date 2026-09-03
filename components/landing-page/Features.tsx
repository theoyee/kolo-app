import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  ClipboardList,
  Receipt,
  ShoppingCart,
  Users,
} from 'lucide-react';

// Same token/type system as the rest of the site.

const features = [
  {
    icon: ShoppingCart,
    title: 'Sales & POS',
    description:
      'Sell faster, record every transaction, and keep your sales history organized.',
    label: 'sell',
  },
  {
    icon: Boxes,
    title: 'Inventory',
    description:
      'Know exactly what is in stock, what is selling, and what needs to be restocked.',
    label: 'manage',
  },
  {
    icon: Users,
    title: 'Customers',
    description:
      'Keep track of your customers, purchase history and outstanding balances.',
    label: 'customers',
  },
  {
    icon: ClipboardList,
    title: 'Orders',
    description:
      'Manage every order from the moment it comes in until it reaches your customer.',
    label: 'orders',
  },
  {
    icon: Receipt,
    title: 'Expenses',
    description:
      'Record your business expenses and understand exactly where your money goes.',
    label: 'money',
  },
  {
    icon: BarChart3,
    title: 'Reports',
    description:
      'Turn your business activity into simple reports that help you make better decisions.',
    label: 'insights',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-kolo-paper-soft section">
      <div className="section-space">
        {/* Header */}
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] text-kolo-currency">
              every tool in one place
            </p>
            <h2 className="mt-3 text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-kolo-ink sm:text-5xl">
              Run your business, not your paperwork
            </h2>
          </div>

          <p className="max-w-md text-[15px] leading-6 text-kolo-muted lg:pb-1">
            Kolo brings the everyday tools you need to sell, manage and
            understand your business into one simple platform.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-px overflow-hidden border border-kolo-hairline bg-kolo-hairline md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative bg-kolo-paper p-8 transition-colors duration-300 hover:bg-white lg:p-10"
              >
                {/* Account number — these tools genuinely are the "accounts"
                    a shop runs, so this label carries real meaning rather
                    than decorating an arbitrary list. */}
                <span className="absolute right-7 top-7 font-mono text-[10px] text-kolo-muted-light">
                  acct. 0{index + 1}
                </span>

                <div className="grid h-11 w-11 place-items-center rounded-sm bg-kolo-ink text-white transition-colors duration-300 group-hover:bg-kolo-currency">
                  <Icon size={18} strokeWidth={2} />
                </div>

                <p className="mt-8 font-mono text-[11px] text-kolo-currency">
                  {feature.label}
                </p>

                <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-kolo-ink">
                  {feature.title}
                </h3>

                <p className="mt-3 max-w-sm text-[13.5px] leading-6 text-kolo-muted">
                  {feature.description}
                </p>

                <div className="mt-7 flex items-center gap-1 text-xs font-semibold text-kolo-ink transition-colors group-hover:text-kolo-currency">
                  Learn more
                  <ArrowUpRight size={13} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-px flex flex-col items-start justify-between gap-5 border border-kolo-hairline bg-kolo-paper p-7 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-lg font-bold text-kolo-ink">
              Everything your business needs.
            </p>
            <p className="mt-1 text-sm text-kolo-muted">
              One platform. One place. Complete control.
            </p>
          </div>

          <a
            href="/signup"
            className="flex items-center rounded-sm bg-kolo-currency px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-kolo-currency-dark"
          >
            Start using Kolo
          </a>
        </div>
      </div>
    </section>
  );
}