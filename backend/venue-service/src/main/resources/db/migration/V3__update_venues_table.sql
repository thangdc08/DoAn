ALTER TABLE venue.venues 
    DROP COLUMN IF EXISTS district,
    ADD COLUMN IF NOT EXISTS email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS open_time TIME,
    ADD COLUMN IF NOT EXISTS close_time TIME,
    ADD COLUMN IF NOT EXISTS policy TEXT,
    ADD COLUMN IF NOT EXISTS court_count INTEGER DEFAULT 0;

-- Create venue_utilities table if it doesn't exist (replacing venue_amenities if needed)
CREATE TABLE IF NOT EXISTS venue.venue_utilities (
    venue_id UUID NOT NULL REFERENCES venue.venues(id) ON DELETE CASCADE,
    utility VARCHAR(100) NOT NULL
);
