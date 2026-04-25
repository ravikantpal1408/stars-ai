export interface Deals {
  // Primary Key
  id: number;

  // Core Deal Info
  deal_id: number;
  deal_name: string;
  approved_amount?: number | null;

  // Joined Data from Lookup Tables
  region_name?: string | null;
  funding_vehicle_name?: string | null;
  currency_code?: string | null;

  // Metadata
  is_active: boolean;
  created_at: string | Date;
}
