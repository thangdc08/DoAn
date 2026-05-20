DO $$
BEGIN
    -- Drop partial indexes first to avoid enum/varchar operator mismatch during type changes.
    IF EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE schemaname = 'booking' AND indexname = 'uq_slot_lock_active'
    ) THEN
        EXECUTE 'DROP INDEX booking.uq_slot_lock_active';
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE schemaname = 'booking' AND indexname = 'uq_booking_item_court_time_active'
    ) THEN
        EXECUTE 'DROP INDEX booking.uq_booking_item_court_time_active';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'booking'
          AND table_name = 'slot_locks'
          AND column_name = 'status'
          AND data_type <> 'character varying'
    ) THEN
        EXECUTE 'ALTER TABLE booking.slot_locks ALTER COLUMN status DROP DEFAULT';
        EXECUTE 'ALTER TABLE booking.slot_locks ALTER COLUMN status TYPE VARCHAR(30) USING (status::text::varchar(30))';
    END IF;
    EXECUTE 'ALTER TABLE booking.slot_locks ALTER COLUMN status SET DEFAULT ''LOCKED''';

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'booking'
          AND table_name = 'bookings'
          AND column_name = 'status'
          AND data_type <> 'character varying'
    ) THEN
        EXECUTE 'ALTER TABLE booking.bookings ALTER COLUMN status DROP DEFAULT';
        EXECUTE 'ALTER TABLE booking.bookings ALTER COLUMN status TYPE VARCHAR(30) USING (status::text::varchar(30))';
    END IF;
    EXECUTE 'ALTER TABLE booking.bookings ALTER COLUMN status SET DEFAULT ''PENDING''';

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'booking'
          AND table_name = 'bookings'
          AND column_name = 'payment_status'
          AND data_type <> 'character varying'
    ) THEN
        EXECUTE 'ALTER TABLE booking.bookings ALTER COLUMN payment_status DROP DEFAULT';
        EXECUTE 'ALTER TABLE booking.bookings ALTER COLUMN payment_status TYPE VARCHAR(30) USING (payment_status::text::varchar(30))';
    END IF;
    EXECUTE 'ALTER TABLE booking.bookings ALTER COLUMN payment_status SET DEFAULT ''UNPAID''';

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'booking'
          AND table_name = 'booking_items'
          AND column_name = 'status'
          AND data_type <> 'character varying'
    ) THEN
        EXECUTE 'ALTER TABLE booking.booking_items ALTER COLUMN status DROP DEFAULT';
        EXECUTE 'ALTER TABLE booking.booking_items ALTER COLUMN status TYPE VARCHAR(30) USING (status::text::varchar(30))';
    END IF;
    EXECUTE 'ALTER TABLE booking.booking_items ALTER COLUMN status SET DEFAULT ''PENDING''';

    -- Recreate partial indexes in varchar world.
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS uq_slot_lock_active ON booking.slot_locks(court_id, start_time, end_time) WHERE status = ''LOCKED''';
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS uq_booking_item_court_time_active ON booking.booking_items(court_id, start_time, end_time) WHERE status IN (''PENDING'', ''BOOKED'')';
END $$;
