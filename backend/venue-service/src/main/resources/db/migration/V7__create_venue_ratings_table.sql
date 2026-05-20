CREATE TABLE IF NOT EXISTS venue_ratings (
    id UUID PRIMARY KEY,
    venue_id UUID NOT NULL,
    user_id UUID NOT NULL,
    stars INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_venue_rating FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
    CONSTRAINT uq_venue_user UNIQUE (venue_id, user_id)
);
