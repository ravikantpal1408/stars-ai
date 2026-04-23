export interface Investor {
  id: number;
  iinvestor_name: string;
  is_parent: boolean;
  bqr_date: string;
  country_of_risk_code: string;
  investor_type_id: number;
  aum_usd: number;
  aum_source_link: string;
  aum_date: string;
  nav_usd: number;
  nav_source_link: string;
  nav_date: string;
  ien_number: string;
  is_national: number;
  investor_comment: string;
  created_by: string;
  created_at: string;
}
