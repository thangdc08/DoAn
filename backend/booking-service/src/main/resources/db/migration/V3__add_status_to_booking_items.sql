ALTER TABLE booking.booking_items
ADD COLUMN IF NOT EXISTS status VARCHAR(30);

UPDATE booking.booking_items
SET status = 'PENDING'
WHERE status IS NULL;

ALTER TABLE booking.booking_items
ALTER COLUMN status SET NOT NULL;
