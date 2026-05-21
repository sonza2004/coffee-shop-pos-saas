import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages (to be implemented)
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentUpload from "./pages/PaymentUpload";
import OrderStatus from "./pages/OrderStatus";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Flow */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/:orderId" element={<PaymentUpload />} />
        <Route path="/order/:id" element={<OrderStatus />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
