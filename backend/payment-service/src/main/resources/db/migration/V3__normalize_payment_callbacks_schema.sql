ALTER TABLE payment.payment_callbacks
ADD COLUMN IF NOT EXISTS transaction_id UUID,
ADD COLUMN IF NOT EXISTS provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS raw_payload JSONB,
ADD COLUMN IF NOT EXISTS signature_valid BOOLEAN,
ADD COLUMN IF NOT EXISTS handled BOOLEAN,
ADD COLUMN IF NOT EXISTS received_at TIMESTAMP;

UPDATE payment.payment_callbacks
SET provider = 'UNKNOWN'
WHERE provider IS NULL OR btrim(provider) = '';

UPDATE payment.payment_callbacks
SET raw_payload = '{}'::jsonb
WHERE raw_payload IS NULL;

UPDATE payment.payment_callbacks
SET signature_valid = FALSE
WHERE signature_valid IS NULL;

UPDATE payment.payment_callbacks
SET handled = FALSE
WHERE handled IS NULL;

UPDATE payment.payment_callbacks
SET received_at = CURRENT_TIMESTAMP
WHERE received_at IS NULL;

ALTER TABLE payment.payment_callbacks
ALTER COLUMN provider SET NOT NULL,
ALTER COLUMN raw_payload SET NOT NULL,
ALTER COLUMN signature_valid SET NOT NULL,
ALTER COLUMN handled SET NOT NULL,
ALTER COLUMN received_at SET NOT NULL;

ALTER TABLE payment.payment_callbacks
ALTER COLUMN handled SET DEFAULT FALSE;
