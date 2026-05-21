import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductsService, Product } from "../services/products.service";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductsService.getAll();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded p-4 cursor-pointer hover:shadow"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <h2 className="font-semibold">{product.name}</h2>
            <p>${product.price}</p>
            <p
              className={
                product.stockQty > 0 ? "text-green-600" : "text-red-500"
              }
            >
              {product.stockQty > 0
                ? `In stock: ${product.stockQty}`
                : "Out of stock"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
