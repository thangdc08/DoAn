-- Initial schema for venue-service
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    address TEXT NOT NULL,
    ward VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location GEOGRAPHY(Point, 4326),
    phone VARCHAR(20),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_APPROVAL',
    rating_avg NUMERIC(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_venues_location ON venues USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_venues_status ON venues(status);
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);

CREATE TABLE IF NOT EXISTS courts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    court_type VARCHAR(50) DEFAULT 'STANDARD',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_venue_court FOREIGN KEY (venue_id) REFERENCES venues(id)
);

CREATE TABLE IF NOT EXISTS price_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL,
    court_id UUID,
    day_of_week INT,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    price_per_hour NUMERIC(12,2) NOT NULL,
    effective_from DATE,
    effective_to DATE,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_venue_price FOREIGN KEY (venue_id) REFERENCES venues(id),
    CONSTRAINT fk_court_price FOREIGN KEY (court_id) REFERENCES courts(id)
);

CREATE TABLE IF NOT EXISTS amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon_url TEXT
);

CREATE TABLE IF NOT EXISTS venue_amenities (
    venue_id UUID NOT NULL,
    amenity_id UUID NOT NULL,
    PRIMARY KEY (venue_id, amenity_id),
    CONSTRAINT fk_venue_amenity FOREIGN KEY (venue_id) REFERENCES venues(id),
    CONSTRAINT fk_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id)
);
