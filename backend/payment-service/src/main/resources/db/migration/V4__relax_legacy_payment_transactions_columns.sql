DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'payment'
          AND table_name = 'payment_transactions'
          AND column_name = 'method_id'
    ) THEN
        EXECUTE 'ALTER TABLE payment.payment_transactions ALTER COLUMN method_id DROP NOT NULL';
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'payment'
          AND table_name = 'payment_transactions'
          AND column_name = 'method_name'
    ) THEN
        EXECUTE 'ALTER TABLE payment.payment_transactions ALTER COLUMN method_name DROP NOT NULL';
    END IF;
END $$;
