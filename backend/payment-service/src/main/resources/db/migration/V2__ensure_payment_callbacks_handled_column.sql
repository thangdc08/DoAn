ALTER TABLE payment.payment_callbacks
ADD COLUMN IF NOT EXISTS handled BOOLEAN;

UPDATE payment.payment_callbacks
SET handled = FALSE
WHERE handled IS NULL;

ALTER TABLE payment.payment_callbacks
ALTER COLUMN handled SET DEFAULT FALSE;

ALTER TABLE payment.payment_callbacks
ALTER COLUMN handled SET NOT NULL;
