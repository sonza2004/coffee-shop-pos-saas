import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../services/api";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

interface OrderResponse {
  id: string;
  status: string;
}

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const createOrder = async () => {
    try {
      setLoading(true);

      const payload = {
        items: cart.map((item) => ({
          productId: item.productId,
          qty: item.qty,
          price: item.price,
        })),
      };

      const res = await post<OrderResponse>("/orders", payload);

      // clear cart after order creation
      localStorage.removeItem("cart");

      // go to payment upload
      navigate(`/payment/${res.id}`);
    } catch (err) {
      alert("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <div className="p-6">No items to checkout</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="mb-4">
        {cart.map((item) => (
          <div key={item.productId} className="border p-2 mb-2">
            {item.name} x {item.qty} = ${item.price * item.qty}
          </div>
        ))}
      </div>

      <p className="font-bold mb-4">Total: ${total}</p>

      <button
        onClick={createOrder}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Creating Order..." : "Confirm Order"}
      </button>
    </div>
  );
};

export default Checkout;
