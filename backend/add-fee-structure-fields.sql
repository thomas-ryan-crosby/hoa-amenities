-- Add fee structure fields to amenities table
DO $$ 
BEGIN
    -- Cancellation Fee Fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'amenities' AND LOWER(column_name) = 'cancellationfeeenabled') THEN
        ALTER TABLE amenities
        ADD COLUMN "cancellationFeeEnabled" BOOLEAN DEFAULT true;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'amenities' AND LOWER(column_name) = 'cancellationfeestructure') THEN
        ALTER TABLE amenities
        ADD COLUMN "cancellationFeeStructure" TEXT NULL;
    END IF;

    -- Modification Fee Fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'amenities' AND LOWER(column_name) = 'modificationfeeenabled') THEN
        ALTER TABLE amenities
        ADD COLUMN "modificationFeeEnabled" BOOLEAN DEFAULT true;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'amenities' AND LOWER(column_name) = 'modificationfeestructure') THEN
        ALTER TABLE amenities
        ADD COLUMN "modificationFeeStructure" TEXT NULL;
    END IF;
END $$;

-- Set default fee structures for existing amenities (using suggested structure)
UPDATE amenities
SET 
    "cancellationFeeStructure" = '{"cancelOver14Days":{"fee":0,"type":"refund"},"cancel7To14Days":{"fee":50,"type":"fixed"},"cancelUnder7Days":{"fee":0,"type":"full_fee"},"noShow":{"fee":0,"type":"full_fee"}}',
    "modificationFeeStructure" = '{"firstChangeOver7Days":{"fee":0,"type":"free"},"additionalChange":{"fee":25,"type":"fixed"}}'
WHERE "cancellationFeeStructure" IS NULL OR "modificationFeeStructure" IS NULL;

