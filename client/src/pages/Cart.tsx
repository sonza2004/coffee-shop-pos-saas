import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  const updateStorage = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const updateQty = (productId: string, qty: number) => {
    const updated = cart.map((item) =>
      item.productId === productId ? { ...item, qty } : item
    );
    updateStorage(updated);
  };

  const removeItem = (productId: string) => {
    const updated = cart.filter((item) => item.productId !== productId);
    updateStorage(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const goCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="p-6">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>

      {cart.map((item) => (
        <div key={item.productId} className="border p-3 mb-2 rounded">
          <h2>{item.name}</h2>
          <p>${item.price}</p>

          <input
            type="number"
            value={item.qty}
            min={1}
            onChange={(e) => updateQty(item.productId, Number(e.target.value))}
            className="border p-1 w-16"
          />

          <button
            onClick={() => removeItem(item.productId)}
            className="ml-2 text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-4">
        <p className="font-bold">Total: ${total}</p>

        <button
          onClick={goCheckout}
          className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
