-- V9: Add optimistic-lock version column to owner_wallets
-- Date: 2026-06-07
ALTER TABLE payment.owner_wallets
    ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN payment.owner_wallets.version
    IS 'Optimistic lock version for JPA @Version';
