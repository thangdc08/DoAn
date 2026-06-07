-- V8: Wallet transaction audit log table
-- Date: 2026-06-07

CREATE TABLE IF NOT EXISTS payment.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    type VARCHAR(20) NOT NULL,           -- CREDIT, DEBIT, PAYOUT_APPROVED, PAYOUT_REJECTED, REFUND
    status VARCHAR(50) NOT NULL,         -- SUCCESS, FAILED
    description VARCHAR(255),
    related_transaction_id UUID,
    related_payout_request_id UUID,
    balance_before NUMERIC(12,2) NOT NULL,
    balance_after NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_owner
    ON payment.wallet_transactions (owner_id, created_at DESC);

COMMENT ON TABLE payment.wallet_transactions IS 'Audit log for all wallet balance changes';
COMMENT ON COLUMN payment.wallet_transactions.type IS 'CREDIT=payment in, DEBIT=payout/refund out';
COMMENT ON COLUMN payment.wallet_transactions.balance_before IS 'Wallet balance before this transaction';
