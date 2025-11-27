import { useState } from "react";
import axios from "axios";
import useCart from "../hooks/useCart";

export default function Cart() {
  const { items, subtotal, update, remove, clear } = useCart();
  const [orderId, setOrderId] = useState<number | null>(null);

  const handleCheckout = async () => {
    try {
      const payload = items.map((item) => ({
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.qty,
      }));

      if (!orderId) {
        const res = await axios.post(
          "https://evaluate.ecommexserver.site/api/v2/orders/variants",
          payload
        );
        setOrderId(res.data.id);
        alert("Order placed!");
      } else {
        await axios.put(
          `https://evaluate.ecommexserver.site/api/v2/orders/variants/${orderId}`,
          payload
        );
        alert("Order updated!");
      }

      clear();
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };

  if (!items.length) return <div>Your cart is empty</div>;

  return (
    <div className="cart-page">
      {items.map((item) => (
        <div key={item.uid} className="cart-item">
          <img src={item.image} alt={item.title} width={80} />
          <div>{item.title}</div>
          <div>Rs. {item.price}</div>
          <input
            type="number"
            value={item.qty}
            min={1}
            onChange={(e) => update(item.uid, { qty: Number(e.target.value) })}
          />
          <button onClick={() => remove(item.uid)}>Remove</button>
        </div>
      ))}

      <div className="cart-summary">
        <div>Subtotal: Rs. {subtotal}</div>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
}
