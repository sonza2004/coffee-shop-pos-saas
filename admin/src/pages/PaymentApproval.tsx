import React, { useEffect, useState } from "react";
import { get, patch } from "../../client/src/services/api";

interface PaymentSlip {
  id: string;
  orderId: string;
  imageUrl: string;
  status: "pending" | "approved" | "rejected";
}

const PaymentApproval: React.FC = () => {
  const [slips, setSlips] = useState<PaymentSlip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlips = async () => {
    try {
      setLoading(true);
      const data = await get<PaymentSlip[]>("/payments");
      setSlips(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlips();
  }, []);

  const approve = async (id: string) => {
    await patch(`/payments/${id}/approve`);
    fetchSlips();
  };

  const reject = async (id: string) => {
    await patch(`/payments/${id}/reject`);
    fetchSlips();
  };

  if (loading) return <div className="p-6">Loading payments...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Approval</h1>

      {slips.map((s) => (
        <div key={s.id} className="border p-4 mb-3">
          <p>Order: {s.orderId}</p>
          <img src={s.imageUrl} alt="slip" className="w-40 my-2" />

          <p>Status: {s.status}</p>

          {s.status === "pending" && (
            <div className="space-x-2">
              <button
                onClick={() => approve(s.id)}
                className="bg-green-600 text-white px-3 py-1"
              >
                Approve
              </button>
              <button
                onClick={() => reject(s.id)}
                className="bg-red-600 text-white px-3 py-1"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentApproval;
