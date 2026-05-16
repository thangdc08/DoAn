CREATE TABLE IF NOT EXISTS venue.venue_images (
    id UUID PRIMARY KEY,
    venue_id UUID NOT NULL REFERENCES venue.venues(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
