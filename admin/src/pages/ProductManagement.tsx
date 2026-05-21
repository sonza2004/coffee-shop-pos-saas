import React, { useEffect, useState } from "react";
import { get, post } from "../../client/src/services/api";

interface Product {
  id: string;
  name: string;
  price: number;
  stockQty: number;
  isActive: boolean;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stockQty, setStockQty] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await get<Product[]>("/products");
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async () => {
    try {
      await post("/products", {
        name,
        price,
        stockQty,
      });

      setName("");
      setPrice(0);
      setStockQty(0);

      fetchProducts();
    } catch (err) {
      alert("Failed to create product");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      <div className="mb-6 border p-4 rounded">
        <h2 className="font-bold mb-2">Create Product</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border p-2 mr-2"
        />

        <input
          type="number"
          placeholder="Stock"
          value={stockQty}
          onChange={(e) => setStockQty(Number(e.target.value))}
          className="border p-2 mr-2"
        />

        <button
          onClick={createProduct}
          className="bg-green-600 text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      <div>
        {products.map((p) => (
          <div key={p.id} className="border p-3 mb-2">
            <h3 className="font-bold">{p.name}</h3>
            <p>Price: ${p.price}</p>
            <p>Stock: {p.stockQty}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
