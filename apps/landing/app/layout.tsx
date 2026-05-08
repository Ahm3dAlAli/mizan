import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mizan — Agentic payment infrastructure for SMEs',
  description: 'The first system that lets autonomous agents authenticate corridors, route value across chains, and settle SME payments in stablecoins—independently, transparently, instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
