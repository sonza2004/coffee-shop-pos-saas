import React, { useEffect, useState } from "react";
import { get } from "../../client/src/services/api";

interface DashboardData {
  totalSales: number;
  totalOrders: number;
  pendingPayments: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await get<DashboardData>("/finance/daily-report");
        setData(res);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return <div className="p-6">No data</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4 rounded">
          <p className="text-gray-500">Total Sales</p>
          <p className="text-xl font-bold">${data.totalSales}</p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-gray-500">Total Orders</p>
          <p className="text-xl font-bold">{data.totalOrders}</p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-gray-500">Pending Payments</p>
          <p className="text-xl font-bold">{data.pendingPayments}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
