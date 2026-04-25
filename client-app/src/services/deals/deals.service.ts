import type { Deals } from "../../model/deal.model";

const API_BASE_URL = "http://localhost:8000/api";

const DealService = {
  getAllDeals: async (): Promise<Deals[]> => {
    const response = await fetch(`${API_BASE_URL}/deals`, {
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

export default DealService;
