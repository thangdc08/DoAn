-- V6: Add refund tracking fields to payment_transactions
-- Date: 2025-06-07

ALTER TABLE payment.payment_transactions
    ADD COLUMN IF NOT EXISTS refunded    BOOLEAN   DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP;

COMMENT ON COLUMN payment.payment_transactions.refunded     IS 'Whether this transaction has been refunded';
COMMENT ON COLUMN payment.payment_transactions.refunded_at IS 'Timestamp of the refund';

CREATE INDEX IF NOT EXISTS idx_payment_transactions_refunded
    ON payment.payment_transactions (refunded)
    WHERE refunded = TRUE;
