package com.badminton.bookingservice.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SchemaNormalizeRunner {

    private final JdbcTemplate jdbcTemplate;

    @Value("${app.schema.auto-normalize:true}")
    private boolean autoNormalize;

    @PostConstruct
    public void normalizeStatusColumns() {
        if (!autoNormalize) {
            log.info("Schema auto-normalize is disabled.");
            return;
        }

        String sql = """
            DO $$
            DECLARE idx RECORD;
            BEGIN
                -- Drop every non-PK index that references status columns, regardless of index name.
                FOR idx IN
                    SELECT i.schemaname, i.indexname
                    FROM pg_indexes i
                    WHERE i.schemaname = 'booking'
                      AND (
                          (i.tablename = 'slot_locks' AND i.indexdef ILIKE '%status%')
                          OR (i.tablename = 'booking_items' AND i.indexdef ILIKE '%status%')
                          OR (i.tablename = 'bookings' AND i.indexdef ILIKE '%status%')
                      )
                      AND i.indexname NOT ILIKE '%pkey'
                LOOP
                    EXECUTE format('DROP INDEX IF EXISTS %I.%I', idx.schemaname, idx.indexname);
                END LOOP;

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

                EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS uq_slot_lock_active ON booking.slot_locks(court_id, start_time, end_time) WHERE status = ''LOCKED''';
                EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS uq_booking_item_court_time_active ON booking.booking_items(court_id, start_time, end_time) WHERE status IN (''PENDING'', ''BOOKED'')';
            END $$;
            """;

        try {
            jdbcTemplate.execute(sql);
            log.info("Schema normalization completed.");
        } catch (Exception ex) {
            log.error("Schema normalization failed.", ex);
            throw ex;
        }
    }
}
