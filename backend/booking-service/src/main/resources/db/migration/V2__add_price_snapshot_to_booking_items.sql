ALTER TABLE booking.booking_items
ADD COLUMN IF NOT EXISTS price_snapshot NUMERIC(19, 2);

UPDATE booking.booking_items
SET price_snapshot = 0
WHERE price_snapshot IS NULL;

ALTER TABLE booking.booking_items
ALTER COLUMN price_snapshot SET NOT NULL;
