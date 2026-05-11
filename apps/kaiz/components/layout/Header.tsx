import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-line bg-bg-2">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-h4 font-medium text-text">KAIZ</div>
            <div className="h-4 w-px bg-green" />
            <div className="text-body-s text-text-2">Dubai, UAE</div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-body-s hover:text-green transition">
              Dashboard
            </Link>
            <Link href="/invoices" className="text-body-s hover:text-green transition">
              Invoices
            </Link>
            <Link href="/payroll" className="text-body-s hover:text-green transition">
              Payroll
            </Link>
            <Link href="/transactions" className="text-body-s hover:text-green transition">
              Transactions
            </Link>
            <Link href="/demo" className="text-body-s hover:text-green transition">
              Quick Demo
            </Link>
            <Link href="/two-party-demo" className="text-body-s hover:text-green transition">
              Two-Party Demo
            </Link>
            <div className="px-4 py-2 bg-green-tint rounded-lg text-body-s">
              <span className="text-green">Testnet</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
