create table if not exists  stars_investor_tbl
(
	ID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	IINVESTOR_NAME VARCHAR(255),
	IS_PARENT BOOLEAN,
	BQR_DATE TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	COUNTRY_OF_RISK_CODE VARCHAR(100),
	INVESTOR_TYPE_ID INT,

	AUM_USD NUMERIC(30,4),
	AUM_SOURCE_LINK VARCHAR(100),
	AUM_DATE TIMESTAMPTZ,
	
	NAV_USD NUMERIC(30,4),
	NAV_SOURCE_LINK VARCHAR(100),
	NAV_DATE TIMESTAMPTZ,
	
	IEN_NUMBER TEXT,
	IS_NATIONAL INT,
	INVESTOR_COMMENT TEXT,
	
	CREATED_BY VARCHAR(100) DEFAULT current_user,
    CREATED_AT TIMESTAMPTZ DEFAULT NOW()	
	
);

INSERT INTO stars_investor_tbl (
    IINVESTOR_NAME, 
    IS_PARENT, 
    BQR_DATE,
    COUNTRY_OF_RISK_CODE, 
    INVESTOR_TYPE_ID, 
    AUM_USD, 
    AUM_SOURCE_LINK, 
    AUM_DATE, 
    NAV_USD, 
    NAV_SOURCE_LINK, 
    NAV_DATE, 
    IEN_NUMBER, 
    IS_NATIONAL, 
    INVESTOR_COMMENT
)
SELECT 
    -- Generates names like 'Alpha Capital 1', 'Beta Ventures 2'
    (ARRAY['Alpha', 'Beta', 'Quantum', 'Horizon', 'Summit', 'Zenith'])[floor(random() * 6 + 1)] || ' ' || 
    (ARRAY['Capital', 'Ventures', 'Holdings', 'Partners', 'Fund'])[floor(random() * 5 + 1)] || ' ' || i,
    
    (random() > 0.7), -- 30% chance of being a Parent
    
    NOW() - (random() * INTERVAL '90 days'), -- Random BQR date in last 3 months
    
    (ARRAY['US', 'IN', 'UK', 'SG', 'AE', 'DE', 'JP'])[floor(random() * 7 + 1)], -- Random Country Codes
    
    floor(random() * 5 + 1)::INT, -- Random Investor Type ID (1-5)
    
    (random() * 5000000000)::NUMERIC(30,4), -- Random AUM up to 5 Billion
    'https://finance-portal.com/audit/report_' || i,
    NOW() - (random() * INTERVAL '180 days'),
    
    (random() * 4500000000)::NUMERIC(30,4), -- Random NAV slightly lower than AUM
    'https://nav-source.org/verify/' || i,
    NOW() - (random() * INTERVAL '30 days'),
    
    'IEN-' || floor(random() * 900000 + 100000)::TEXT, -- Unique IEN String
    
    (CASE WHEN random() > 0.5 THEN 1 ELSE 0 END), -- Random National flag
    'Bulk generated test data for entry #' || i
    
FROM generate_series(1, 50) AS i;