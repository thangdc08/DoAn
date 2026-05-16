-- Drop and recreate venue_images to ensure schema consistency
DROP TABLE IF EXISTS venue.venue_images CASCADE;

CREATE TABLE venue.venue_images (
    id UUID PRIMARY KEY,
    venue_id UUID NOT NULL REFERENCES venue.venues(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
