-- Add owner_id and venue_id columns to payment_transactions
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS owner_id UUID;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS venue_id UUID;

-- Create owner_wallets table
CREATE TABLE IF NOT EXISTS owner_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL UNIQUE,
    balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_earned NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_withdrawn NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on owner_id
CREATE INDEX IF NOT EXISTS idx_owner_wallets_owner ON owner_wallets(owner_id);

-- Create payout_requests table
CREATE TABLE IF NOT EXISTS payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    bank_name VARCHAR(100) NOT NULL,
    bank_account VARCHAR(50) NOT NULL,
    bank_account_name VARCHAR(100) NOT NULL,
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Create index on owner_id for payout_requests
CREATE INDEX IF NOT EXISTS idx_payout_requests_owner ON payout_requests(owner_id);
