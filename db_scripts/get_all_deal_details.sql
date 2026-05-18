CREATE OR REPLACE FUNCTION get_all_deal_details()
RETURNS TABLE (
    id BIGINT,
    deal_id INTEGER,
    deal_name TEXT,
    approved_amount NUMERIC,
    region_name VARCHAR,
    funding_vehicle_name VARCHAR,
    currency_code VARCHAR,
    is_active BOOLEAN,
    created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.ID,
        d.DEAL_ID,
        d.DEAL_NAME,
        d.APPROVED_AMOUNT,
        r.REGION_NAME,
        fv.FUNDING_VEHICLE_NAME,
        c.CURRENCY_CODE,
        d.IS_ACTIVE,
        d.CREATED_AT
    FROM STARS_DEAL d
    LEFT JOIN STARS_REGION r ON d.INVESTMENT_REGION_ID = r.ID
    LEFT JOIN STARS_FUNDING_VEHICLE fv ON d.FUNDING_VEHICLE_ID = fv.ID
    LEFT JOIN STARS_CURRENCY c ON d.DEAL_CURRENCY_ID = c.ID;
END;
$$;

-- How to call it:
SELECT * FROM get_all_deal_details();