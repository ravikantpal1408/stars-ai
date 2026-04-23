import React, { useEffect, useState } from "react";
import InvestorService from "../../services/investors/investors.service";
import { type Investor } from "../../model/investors.model.ts";

function InvstorDashboard() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getInvestors = async () => {
    try {
      setLoading(true);
      const data = await InvestorService.getAllInvestors();
      setInvestors(data);
    } catch (error) {
      console.error("Failed to load investors:", error);
    } finally {
      setLoading(false);
    }
  };

  // 5. Trigger the fetch on component mount
  useEffect(() => {
    getInvestors();
  }, []);

  return (
    <div>
      <h1>Investor Dashboard</h1>
      {loading ? (
        <p>Loading investors...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>AUM (USD)</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((investor) => (
              <tr key={investor.id}>
                <td>{investor.iinvestor_name}</td>
                <td>{investor.aum_usd.toLocaleString()}</td>
                <td>{investor.country_of_risk_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InvstorDashboard;
