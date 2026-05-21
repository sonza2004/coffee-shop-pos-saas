import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "../services/api";

interface Order {
  id: string;
  status: "pending" | "payment_uploaded" | "approved" | "rejected" | "completed";
  totalAmount: number;
}

const OrderStatus: React.FC = () => {
  const { id } = useParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await get<Order>(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-6">Loading order...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  const statusColor = {
    pending: "text-yellow-500",
    payment_uploaded: "text-blue-500",
    approved: "text-green-600",
    rejected: "text-red-500",
    completed: "text-green-700",
  }[order.status];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Status</h1>

      <p>Order ID: {order.id}</p>
      <p>Total: ${order.totalAmount}</p>

      <p className={`font-bold mt-2 ${statusColor}`}>
        Status: {order.status}
      </p>
    </div>
  );
};

export default OrderStatus;
