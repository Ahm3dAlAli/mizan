'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function InvoicesPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-ink">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-ivory-3 hover:text-lime mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-medium mb-4">Upload Invoices</h1>
          <p className="text-ivory-3 text-lg">
            Batch upload invoices via CSV for AI-powered payroll processing
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
              dragActive
                ? 'border-lime bg-lime/5'
                : 'border-ivory/20 bg-ink-2'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              accept=".csv"
              onChange={handleChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer"
            >
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-medium mb-2">
                {file ? file.name : 'Drop CSV file here or click to browse'}
              </h3>
              <p className="text-ivory-3 text-sm mb-4">
                Maximum file size: 10MB
              </p>
              {!file && (
                <button className="px-6 py-3 bg-lime text-ink rounded-lg font-medium hover:bg-lime/90 transition">
                  Select File
                </button>
              )}
            </label>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-between p-4 rounded-lg border border-ivory/10 bg-ink-2">
              <div className="flex items-center gap-3">
                <div className="text-2xl">✓</div>
                <div>
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-ivory-3">
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-ivory-3 hover:text-lime transition"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* CSV Format Guide */}
        <div className="mb-8 p-6 rounded-lg border border-ivory/10 bg-ink-2">
          <h2 className="text-xl font-medium mb-4">CSV Format Requirements</h2>
          <div className="space-y-3 text-sm">
            <p className="text-ivory-3">Your CSV file should include the following columns:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded bg-ink border border-ivory/10">
                <span className="font-mono text-lime">recipient_name</span>
                <p className="text-ivory-3 text-xs mt-1">Full name of recipient</p>
              </div>
              <div className="p-3 rounded bg-ink border border-ivory/10">
                <span className="font-mono text-lime">recipient_address</span>
                <p className="text-ivory-3 text-xs mt-1">Blockchain wallet address</p>
              </div>
              <div className="p-3 rounded bg-ink border border-ivory/10">
                <span className="font-mono text-lime">amount</span>
                <p className="text-ivory-3 text-xs mt-1">Payment amount in local currency</p>
              </div>
              <div className="p-3 rounded bg-ink border border-ivory/10">
                <span className="font-mono text-lime">currency</span>
                <p className="text-ivory-3 text-xs mt-1">Local currency code (PHP, INR, etc.)</p>
              </div>
              <div className="p-3 rounded bg-ink border border-ivory/10">
                <span className="font-mono text-lime">destination_country</span>
                <p className="text-ivory-3 text-xs mt-1">Country code or name</p>
              </div>
              <div className="p-3 rounded bg-ink border border-ivory/10">
                <span className="font-mono text-lime">description</span>
                <p className="text-ivory-3 text-xs mt-1">Optional payment description</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample CSV */}
        <div className="mb-8 p-6 rounded-lg border border-ivory/10 bg-ink-2">
          <h2 className="text-xl font-medium mb-4">Example CSV</h2>
          <div className="bg-ink p-4 rounded border border-ivory/10 overflow-x-auto">
            <pre className="text-sm font-mono text-ivory-3">
{`recipient_name,recipient_address,amount,currency,destination_country,description
Maria Santos,0x1234...5678,8500,PHP,Philippines,Monthly freelance payment
Rajesh Kumar,0xabcd...ef01,12000,INR,India,Design work - March 2026
Ahmed Hassan,0x9876...5432,6500,EGP,Egypt,Content writing services`}
            </pre>
          </div>
          <button className="mt-4 text-lime hover:text-lime/80 text-sm">
            Download Sample CSV
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link
            href="/"
            className="px-6 py-3 border border-ivory/20 rounded-lg font-medium hover:border-ivory/40 transition"
          >
            Cancel
          </Link>
          <button
            disabled={!file}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              file
                ? 'bg-lime text-ink hover:bg-lime/90'
                : 'bg-ivory/10 text-ivory-3 cursor-not-allowed'
            }`}
          >
            Process Invoices
          </button>
        </div>
      </div>
    </div>
  );
}
