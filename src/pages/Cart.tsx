// src/pages/Cart.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../types";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://evaluate.ecommexserver.site";

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(stored);
  }, []);

  if (!items.length) return <div className="center">Your cart is empty.</div>;

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    // Prepare payload for the API
    const orderData = {
      customer_id: 5, // replace with actual logged-in user ID
      payment_status: 1,
      payment_method: "card",
      delivery_fee: 300, // example
      delivery_address: "45 Temple Road, Colombo", // example
      note: "Please deliver ASAP",
      status: 1,
      total_price: total,
      items: items.map((i) => ({
        product_id: i.productId,
        quantity: i.qty,
        unit_price: i.price,
        total_price: i.price * i.qty,
        variants: i.variantId ? [{ variant_id: i.variantId }] : [],
      })),
    };

    try {
      const res = await axios.post(`${API_BASE}/api/v2/orders/variants`, orderData);
      alert("Order placed successfully! Order ID: " + res.data.orderId);

      // Clear cart
      localStorage.removeItem("cart");
      setItems([]);
      nav("/"); // redirect to home
    } catch (err: any) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>Cart</h1>
      <div className="cart-list">
        {items.map((item) => (
          <div key={item.uid} className="cart-row">
            <img src={item.image} alt={item.title} />
            <div>
              <h3>{item.title}</h3>
              <p>Qty: {item.qty}</p>
              <p>Rs. {item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="summary">
        <p>Total: Rs. {total}</p>
        {error && <p className="error">{error}</p>}
        <button className="btn-primary" onClick={handlePlaceOrder} disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </main>
  );
}
