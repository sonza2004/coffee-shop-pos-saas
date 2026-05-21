import React, { useEffect, useState } from "react";
import { get } from "../../client/src/services/api";

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await get<Order[]>("/orders");
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      {/* Orders List */}
      <div>
        <h1 className="text-xl font-bold mb-4">Orders</h1>

        {orders.map((order) => (
          <div
            key={order.id}
            className="border p-3 mb-2 cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedOrder(order)}
          >
            <p>ID: {order.id}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.totalAmount}</p>
          </div>
        ))}
      </div>

      {/* Order Detail */}
      <div className="border p-4">
        <h2 className="font-bold mb-2">Order Detail</h2>

        {selectedOrder ? (
          <div>
            <p><b>ID:</b> {selectedOrder.id}</p>
            <p><b>Status:</b> {selectedOrder.status}</p>
            <p><b>Total:</b> ${selectedOrder.totalAmount}</p>
            <p><b>Date:</b> {selectedOrder.createdAt}</p>
          </div>
        ) : (
          <p>Select an order</p>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
