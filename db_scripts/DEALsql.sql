

-- 2. Create the Main Table with Foreign Key Constraints
CREATE TABLE STARS_DEAL (
    ID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    DEAL_ID INTEGER UNIQUE, 
    DEAL_NAME TEXT NOT NULL,
    APPROVED_AMOUNT NUMERIC(30,4),
    
    -- Changed these to BIGINT to match the Parent IDs
    INVESTMENT_REGION_ID BIGINT,
    FUNDING_VEHICLE_ID BIGINT,
    DEAL_CURRENCY_ID BIGINT,
    STARS_REGION_ID BIGINT,
    
    IS_ACTIVE BOOLEAN DEFAULT TRUE,
    CREATED_BY VARCHAR(100) DEFAULT current_user,
    CREATED_AT TIMESTAMPTZ DEFAULT NOW(),

    -- Foreign Key Constraints
    CONSTRAINT FK_STARS_DEAL_REGION 
        FOREIGN KEY (INVESTMENT_REGION_ID) 
        REFERENCES STARS_REGION(ID),
        
    CONSTRAINT FK_STARS_DEAL_VEHICLE 
        FOREIGN KEY (FUNDING_VEHICLE_ID) 
        REFERENCES STARS_FUNDING_VEHICLE(ID),
        
    CONSTRAINT FK_STARS_DEAL_CURRENCY 
        FOREIGN KEY (DEAL_CURRENCY_ID) 
        REFERENCES STARS_CURRENCY(ID)
);

INSERT INTO STARS_DEAL (
    DEAL_ID, 
    DEAL_NAME, 
    APPROVED_AMOUNT, 
    INVESTMENT_REGION_ID, 
    FUNDING_VEHICLE_ID, 
    DEAL_CURRENCY_ID, 
    IS_ACTIVE
)
SELECT 
    1000 + i,                                    -- DEAL_ID starting from 1001
    'Project ' || chr(65 + (i % 26)) || i,       -- Generates names like "Project A1", "Project B2"
    (random() * 10000000)::NUMERIC(30,4),        -- Random amount up to 10 Million
    (SELECT ID FROM STARS_REGION ORDER BY random() LIMIT 1),          -- Random Foreign Key
    (SELECT ID FROM STARS_FUNDING_VEHICLE ORDER BY random() LIMIT 1), -- Random Foreign Key
    (SELECT ID FROM STARS_CURRENCY ORDER BY random() LIMIT 1),        -- Random Foreign Key
    TRUE
FROM generate_series(1, 100) AS i;