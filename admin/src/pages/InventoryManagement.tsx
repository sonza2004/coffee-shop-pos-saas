import React, { useEffect, useState } from "react";
import { get, post } from "../../client/src/services/api";

interface Inventory {
  productId: string;
  name: string;
  stockQty: number;
}

const InventoryManagement: React.FC = () => {
  const [items, setItems] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const [changeQty, setChangeQty] = useState(0);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await get<Inventory[]>("/inventory");
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const adjustStock = async () => {
    try {
      await post("/inventory/adjust", {
        productId,
        changeQty,
      });

      setProductId("");
      setChangeQty(0);

      fetchInventory();
    } catch (err) {
      alert("Failed to adjust stock");
    }
  };

  if (loading) return <div className="p-6">Loading inventory...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>

      <div className="mb-6 border p-4">
        <h2 className="font-bold mb-2">Adjust Stock</h2>

        <input
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          type="number"
          placeholder="Change Qty"
          value={changeQty}
          onChange={(e) => setChangeQty(Number(e.target.value))}
          className="border p-2 mr-2"
        />

        <button
          onClick={adjustStock}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Apply
        </button>
      </div>

      <div>
        {items.map((i) => (
          <div key={i.productId} className="border p-3 mb-2">
            <p>{i.name}</p>
            <p>Stock: {i.stockQty}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryManagement;
