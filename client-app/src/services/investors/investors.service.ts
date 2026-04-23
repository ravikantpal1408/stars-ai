import { type Investor } from "../../model/investors.model.ts";

const API_BASE_URL = "http://localhost:8000/api";

const InvestorService = {
  getAllInvestors: async (): Promise<Investor[]> => {
    const response = await fetch(`${API_BASE_URL}/investors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("service ", response);

    if (!response.ok) {
      throw new Error(`Failed to fetch investors. Status: ${response.status}`);
    }

    // This returns the array of JSON objects typed as Investor[]
    return response.json();
  },
};

export default InvestorService;
