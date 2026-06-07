-- V7: system_configs table for configurable platform settings
-- Date: 2025-06-07

CREATE TABLE IF NOT EXISTS payment.system_configs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key    VARCHAR(100) NOT NULL UNIQUE,
    config_value  TEXT,
    description   VARCHAR(255),
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT now()
);

COMMENT ON TABLE payment.system_configs IS 'Key-value system configuration table';
COMMENT ON COLUMN payment.system_configs.config_key   IS 'Unique configuration key';
COMMENT ON COLUMN payment.system_configs.config_value IS 'Configuration value (string, parsed as needed)';

-- Seed default commission rate (5%)
INSERT INTO payment.system_configs (config_key, config_value, description)
VALUES ('commission_rate', '0.05', 'Platform commission rate as decimal (e.g. 0.05 = 5%)')
ON CONFLICT (config_key) DO NOTHING;
