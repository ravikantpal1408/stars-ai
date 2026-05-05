import { type Investor } from "../../model/investors.model.ts";

const API_BASE_URL = "http://localhost:8000/api";

// Define an interface for the paginated response
export interface PaginatedInvestors {
  data: Investor[];
  total: number;
}

const InvestorService = {
  getAllInvestors: async (
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedInvestors> => {
    // Construct the URL with query parameters
    const url = `${API_BASE_URL}/investors?page=${page}&page_size=${pageSize}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch investors. Status: ${response.status}`);
    }

    // Expecting the backend to return: { "data": [...], "total": 100 }
    return response.json();
  },
};

export default InvestorService;
