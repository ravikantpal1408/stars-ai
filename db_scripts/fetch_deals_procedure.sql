CREATE OR REPLACE PROCEDURE fetch_deals_procedure(INOUT result_cursor REFCURSOR)
LANGUAGE plpgsql
AS $$
BEGIN
    -- We do not need to DECLARE result_cursor because it is an INOUT parameter
    -- But we must ensure the OPEN statement uses it correctly
    OPEN result_cursor FOR 
    SELECT 
        d.ID,
        d.DEAL_ID,
        d.DEAL_NAME,
        d.APPROVED_AMOUNT,
        r.REGION_NAME, 
        fv.FUNDING_VEHICLE_NAME, 
        c.CURRENCY_CODE,
		d.IS_ACTIVE,
		d.CREATED_AT,  -- <--- Make sure this is here!
        d.CREATED_BY  -- <--- And this, if your model needs it
        
    FROM STARS_DEAL d
    LEFT JOIN STARS_REGION r ON d.INVESTMENT_REGION_ID = r.ID
    LEFT JOIN STARS_FUNDING_VEHICLE fv ON d.FUNDING_VEHICLE_ID = fv.ID
    LEFT JOIN STARS_CURRENCY c ON d.DEAL_CURRENCY_ID = c.ID;
END;
$$;