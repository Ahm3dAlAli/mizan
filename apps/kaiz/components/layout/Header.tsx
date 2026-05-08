import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-ivory/10 bg-ink-2">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-2xl font-medium">KAIZ</div>
            <div className="h-4 w-px bg-lime" />
            <div className="text-sm text-ivory-3">Dubai, UAE</div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-lime transition">
              Dashboard
            </Link>
            <Link href="/demo" className="text-sm hover:text-lime transition">
              Quick Demo
            </Link>
            <div className="px-4 py-2 bg-lime/10 rounded-lg text-sm">
              <span className="text-ivory-3">Testnet</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
