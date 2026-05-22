ALTER TABLE booking.booking_items
ADD COLUMN IF NOT EXISTS venue_name_snapshot VARCHAR(255);

UPDATE booking.booking_items
SET venue_name_snapshot = 'Unknown venue'
WHERE venue_name_snapshot IS NULL OR btrim(venue_name_snapshot) = '';

ALTER TABLE booking.booking_items
ALTER COLUMN venue_name_snapshot SET DEFAULT 'Unknown venue';

ALTER TABLE booking.booking_items
ALTER COLUMN venue_name_snapshot SET NOT NULL;
