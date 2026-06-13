CREATE TABLE IF NOT EXISTS stars_investor_tbl (
    id SERIAL PRIMARY KEY,
    investor_name VARCHAR(255) NOT NULL,
    bqr_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    country_of_risk_code VARCHAR(10) NOT NULL,
    investor_type_id INTEGER NOT NULL,
    aum_usd NUMERIC(15, 2) NOT NULL,
    aum_source_link VARCHAR(1024) NOT NULL,
    aum_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    nav_usd NUMERIC(15, 2) NOT NULL,
    nav_source_link VARCHAR(1024) NOT NULL,
    nav_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    ien_number VARCHAR(50) NOT NULL,
    is_national INTEGER DEFAULT 0 NOT NULL,
    investor_comment VARCHAR(500) NULL,
    created_by VARCHAR(100) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_stars_investor_id_desc ON stars_investor_tbl (id DESC);

DO $$
DECLARE
    i INT := 1;
    v_investor_name TEXT;
    v_country TEXT;
    v_type_id INT;
    v_aum NUMERIC(15,2);
    v_nav NUMERIC(15,2);
    v_base_date TIMESTAMP;
    v_countries TEXT[] := ARRAY['US', 'GB', 'DE', 'JP', 'CA', 'FR', 'AU', 'SG'];
    v_suffixes TEXT[] := ARRAY['Capital', 'Holdings', 'Fund', 'Ventures', 'Asset Management'];
    v_first_names TEXT[] := ARRAY['Apex', 'BlueSky', 'Vanguard', 'Summit', 'Meridian', 'Horizon', 'Quantum', 'Pacific', 'Trident', 'Atlas'];
BEGIN
    WHILE i <= 1000 LOOP
        v_investor_name := v_first_names[floor(random() * array_length(v_first_names, 1) + 1)] || ' ' || 
                           v_suffixes[floor(random() * array_length(v_suffixes, 1) + 1)] || ' ' || 
                           chr(65 + (i % 26)) || i;
        v_country := v_countries[floor(random() * array_length(v_countries, 1) + 1)];
        v_type_id := floor(random() * 5 + 1);
        v_aum := round((random() * (2500000000 - 5000000) + 5000000)::numeric, 2);
        v_nav := round((v_aum * random())::numeric, 2);
        v_base_date := NOW() - (random() * 1000 || ' days')::INTERVAL;

        -- Notice the target layout change here: public.stars_investor_tbl
        INSERT INTO public.stars_investor_tbl (
            investor_name, bqr_date, country_of_risk_code, investor_type_id,
            aum_usd, aum_source_link, aum_date,
            nav_usd, nav_source_link, nav_date,
            ien_number, is_national, investor_comment, created_by, created_on
        ) VALUES (
            v_investor_name, v_base_date, v_country, v_type_id,
            v_aum, 'https://example.com/source/' || md5(random()::text), v_base_date - INTERVAL '15 days',
            v_nav, 'https://example.com/source/' || md5(random()::text), v_base_date - INTERVAL '15 days',
            'IEN-' || floor(random() * (999999 - 100000) + 100000)::text,
            floor(random() * 2)::int,
            CASE WHEN random() > 0.3 THEN 'Automated simulation payload comment row ' || i ELSE NULL END,
            'sql_backfill_engine', NOW()
        );

        i := i + 1;
    END LOOP;
END $$;