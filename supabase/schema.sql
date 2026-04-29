-- Mizan Database Schema
-- Part of Mizan extension to ArcPay
-- Supabase PostgreSQL schema for Kaiz demo app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Freelancers table
CREATE TABLE freelancers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  wallet_address TEXT,
  country TEXT NOT NULL,
  preferred_corridor TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freelancer_id UUID REFERENCES freelancers(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')),
  memo TEXT,
  file_url TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payroll runs table
CREATE TABLE payroll_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_ids UUID[] NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL,
  recipients_count INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  rules TEXT DEFAULT 'strict',
  dry_run BOOLEAN DEFAULT FALSE,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration NUMERIC(8, 3)
);

-- Agent actions table (reasoning log)
CREATE TABLE agent_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payroll_run_id UUID REFERENCES payroll_runs(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL CHECK (agent_name IN ('supervisor', 'classifier', 'treasurer', 'payables', 'gatekeeper')),
  action TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  tools_called JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payroll_run_id UUID REFERENCES payroll_runs(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  corridor TEXT NOT NULL,
  chain TEXT NOT NULL,
  tx_hash TEXT NOT NULL,
  recipient TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  fee NUMERIC(12, 2) DEFAULT 0,
  settlement_time NUMERIC(8, 3),
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Corridors stats table
CREATE TABLE corridor_stats (
  corridor_id TEXT PRIMARY KEY,
  total_transactions INTEGER DEFAULT 0,
  total_volume NUMERIC(16, 2) DEFAULT 0,
  average_amount NUMERIC(12, 2) DEFAULT 0,
  success_rate NUMERIC(5, 2) DEFAULT 100,
  average_settlement_time NUMERIC(8, 3) DEFAULT 0,
  average_fee NUMERIC(12, 2) DEFAULT 0,
  last_transaction_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_invoices_freelancer ON invoices(freelancer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payroll_runs_status ON payroll_runs(status);
CREATE INDEX idx_payroll_runs_created ON payroll_runs(created_at DESC);
CREATE INDEX idx_agent_actions_payroll ON agent_actions(payroll_run_id);
CREATE INDEX idx_agent_actions_agent ON agent_actions(agent_name);
CREATE INDEX idx_transactions_payroll ON transactions(payroll_run_id);
CREATE INDEX idx_transactions_invoice ON transactions(invoice_id);
CREATE INDEX idx_transactions_corridor ON transactions(corridor);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_freelancers_updated_at BEFORE UPDATE ON freelancers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial corridor stats
INSERT INTO corridor_stats (corridor_id) VALUES
  ('uae-to-philippines'),
  ('uae-to-india'),
  ('uae-to-egypt'),
  ('uae-to-pakistan'),
  ('uae-to-nigeria')
ON CONFLICT (corridor_id) DO NOTHING;

-- Seed data: Sample freelancers
INSERT INTO freelancers (name, email, wallet_address, country, preferred_corridor) VALUES
  ('Pedro Santos', 'pedro@studio.dev', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1', 'PH', 'uae-to-philippines'),
  ('Amaka Obi', 'amaka@designs.ng', '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 'NG', 'uae-to-nigeria'),
  ('Raj Patel', 'raj@techstudio.in', '0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B', 'IN', 'uae-to-india'),
  ('Ahmed Hassan', 'ahmed@creative.eg', '0x2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c', 'EG', 'uae-to-egypt'),
  ('Fatima Khan', 'fatima@webdev.pk', '0x3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D', 'PK', 'uae-to-pakistan'),
  ('Maria Cruz', 'maria@design.ph', '0x4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e', 'PH', 'uae-to-philippines')
ON CONFLICT (email) DO NOTHING;

-- Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE freelancers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE corridor_stats ENABLE ROW LEVEL SECURITY;

-- For demo purposes, allow all operations (in production, restrict by user auth)
CREATE POLICY "Allow all operations" ON freelancers FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON payroll_runs FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON agent_actions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON corridor_stats FOR ALL USING (true);
