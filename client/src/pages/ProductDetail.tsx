import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductsService, Product } from "../services/products.service";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await ProductsService.getById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    const existing: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const index = existing.findIndex((i) => i.productId === product.id);

    if (index >= 0) {
      existing[index].qty += qty;
    } else {
      existing.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existing));

    navigate("/cart");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-lg">Price: ${product.price}</p>

      <p className={product.stockQty > 0 ? "text-green-600" : "text-red-500"}>
        {product.stockQty > 0
          ? `In stock: ${product.stockQty}`
          : "Out of stock"}
      </p>

      <div className="mt-4">
        <label>Quantity:</label>
        <input
          type="number"
          value={qty}
          min={1}
          max={product.stockQty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="border ml-2 p-1"
        />
      </div>

      <button
        onClick={addToCart}
        disabled={product.stockQty === 0}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;
