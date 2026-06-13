CREATE table if not exists  stars_deals_tbl (
    id SERIAL PRIMARY KEY,
    deal_id INTEGER NOT NULL,
    deal_name VARCHAR(255) NOT NULL,
    investor_id INTEGER NOT NULL,
    region_id INTEGER NOT NULL,
    approved_amount NUMERIC(18, 2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    --  FIXED: Using the correct Postgres operator syntax
    created_on TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    created_by VARCHAR(100) NOT NULL,
    
    CONSTRAINT fk_deals_investor FOREIGN KEY (investor_id) 
        REFERENCES stars_investor_tbl(id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_deals_investor_id ON stars_deals_tbl(investor_id);


DO $$
DECLARE
    investor_id_array INTEGER[];
    investor_count INTEGER;
BEGIN
    -- 1. Gather all valid parent IDs into an array for lightning-fast lookups
    investor_id_array := ARRAY(SELECT id FROM stars_investor_tbl);
    investor_count := cardinality(investor_id_array);
    
    -- Safety Check: Ensure there are actually investors to reference
    IF investor_count = 0 THEN
        RAISE EXCEPTION 'Aborting script: "stars_investor_tbl" is empty. Please seed investors first to avoid Foreign Key violations.';
    END IF;

    RAISE NOTICE 'Found % investors. Generating 50,000 randomized deals...', investor_count;

    -- 2. Generate and batch-insert 50,000 randomized rows
    INSERT INTO stars_deals_tbl (
        deal_id, 
        deal_name, 
        investor_id, 
        region_id, 
        approved_amount, 
        is_active, 
        created_on, 
        created_by
    )
    SELECT 
        -- Random deal_id between 100000 and 999999
        floor(random() * (999999 - 100000 + 1) + 100000)::INTEGER AS deal_id,
        
        -- Construct a distinct deal name based on the sequence block
        (ARRAY['Alpha Growth Fund', 'Project Apollo', 'Horizon Ventures', 'Omega Seed', 'Stellar Series A', 'Catalyst Growth', 'Nexus Capital', 'Vanguard Expansion'])[floor(random() * 8) + 1] 
            || ' - Block ' || series_seq.val AS deal_name,
            
        -- Pick a completely random investor ID from our pre-loaded array
        investor_id_array[floor(random() * investor_count) + 1] AS investor_id,
        
        -- Random region_id between 1 and 10
        floor(random() * 10 + 1)::INTEGER AS region_id,
        
        -- Random approved_amount between $10,000.00 and $5,000,000.00
        ROUND((random() * (5000000.00 - 10000.00) + 10000.00)::NUMERIC, 2) AS approved_amount,
        
        -- Randomize is_active (approx. 85% True, 15% False)
        (random() < 0.85) AS is_active,
        
        -- Random creation timestamp distributed within the last 365 days
        NOW() AT TIME ZONE 'UTC' - (random() * INTERVAL '365 days') AS created_on,
        
        -- Randomly select a creating user
        (ARRAY['ravi', 'system_seed', 'admin_ai', 'migration_job', 'pipeline_worker'])[floor(random() * 5) + 1] AS created_by

    -- Generates a virtual series to loop exactly 50,000 times
    FROM generate_series(1, 50000) AS series_seq(val);

    RAISE NOTICE '🎉 Successfully backfilled 50,000 randomized records into stars_deals_tbl!';
END $$;