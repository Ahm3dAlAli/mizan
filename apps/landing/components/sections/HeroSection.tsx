'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const codeSnippet = `$ npm install @mizan/sdk

import { mizan } from '@mizan/sdk'

await mizan
  .corridor('uae-to-philippines')
  .pay({
    to: 'pedro@studio.dev',
    amount: 850
  })

// Settled on Arc in 3 seconds.`;

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-bg-dark">
      {/* Animated green spotlight */}
      <motion.div
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] bg-green-tint/30"
        animate={{ opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Navigation */}
      <motion.nav
        className="absolute top-8 left-0 right-0 px-6 flex items-center justify-between max-w-container mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="text-green text-h4 font-medium">MIZAN</div>
          <div className="h-4 w-px bg-green/30" />
        </div>
        <div className="flex items-center gap-6 text-body-s text-text-on-dark-2">
          <a href="http://localhost:3000/demo" className="hover:text-green-2 transition">
            Demo
          </a>
          <a href="https://github.com/Ahm3dAlAli/arcpay-main" target="_blank" rel="noopener noreferrer" className="hover:text-green-2 transition">
            GitHub ↗
          </a>
          <a href="#docs" className="hover:text-green-2 transition">
            Docs
          </a>
        </div>
      </motion.nav>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
        {/* Logo/Title */}
        <motion.h1
          className="text-h1 font-medium text-green"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          MIZAN
        </motion.h1>

        {/* Tagline */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-h2 font-medium text-text-on-dark leading-tight">
            Agentic payment infrastructure for SMEs.
          </h2>
          <p className="text-body-l text-text-on-dark-2 max-w-3xl mx-auto">
            Mizan is the first system that lets autonomous agents authenticate corridors,
            route value across chains, and settle SME payments in stablecoins—independently,
            transparently, instantly.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex items-center justify-center gap-4 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <a
            href="http://localhost:3000/demo"
            className="px-8 py-4 bg-green text-bg-elev rounded-lg font-medium hover:bg-green-2 transition shadow-sm"
          >
            Watch the Demo →
          </a>
          <a
            href="https://github.com/Ahm3dAlAli/arcpay-main"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-line-on-dark text-text-on-dark rounded-lg font-medium hover:bg-green/10 transition"
          >
            GitHub ↗
          </a>
        </motion.div>

        {/* Code Snippet */}
        <motion.div
          className="relative max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="relative bg-bg-elev rounded-lg p-6 text-left shadow-hero">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 px-3 py-1 text-eyebrow bg-green-tint text-green rounded hover:bg-green-tint/70 transition"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <pre className="font-mono text-body-s text-text overflow-x-auto">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        </motion.div>

        {/* Attribution */}
        <motion.p
          className="text-body-s text-text-faint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          Built on ArcPay (3 prior Arc Hackathon awards).
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex flex-col items-center gap-2 text-text-faint text-eyebrow">
          <span>Scroll to explore</span>
          <svg
            className="w-4 h-4 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
