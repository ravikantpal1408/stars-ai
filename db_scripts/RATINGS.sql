CREATE TABLE stars_ratings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bqr INTEGER CHECK (bqr >= 0), -- Added check constraint
    default_internal VARCHAR(100),
    lgd VARCHAR(100),
    lgd_percent DECIMAL(8, 4) CHECK (lgd_percent <= 100), -- Fixed typo and added cap
    internal_code VARCHAR(100) NOT NULL, -- Added NOT NULL if this is a business key
    
    is_active BOOLEAN DEFAULT TRUE,    
    created_by VARCHAR(100) DEFAULT CURRENT_USER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Optional: Add a unique constraint if internal_code should not repeat
    CONSTRAINT unique_internal_code UNIQUE (internal_code)
);

/


INSERT INTO STARS_RATINGS 
    (BQR, DEFAULT_INTERNAL, LGD, LGD_PERCENT, INTERNAL_CODE, IS_ACTIVE)
VALUES 
    (0, 'TBD', 'TBD', 0.000, 'TBD', true),
    (15, 'DEFAULT', 'DEFAULT', 10.000, 'RII-DEF-01', true),
    (25, 'STANDARD', 'STANDARD', 25.440, 'CVQ-STD-02', true),
    (35, 'INTERNAL', 'CONSERVATIVE', 44.460, 'RII-CON-03', true);



select * from stars_ratings sr ;