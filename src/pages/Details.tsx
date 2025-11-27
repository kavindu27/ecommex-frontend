// src/pages/Details.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Products, Variant } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE || "https://evaluate.ecommexserver.site";

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [product, setProduct] = useState<Products | null>(null);
  const [selected, setSelected] = useState<Variant | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    axios
      .get(`${API_BASE}/api/v2/products/all/variant?store_id=4`)
      .then((res) => {
        if (!mounted) return;
        const list: Products[] = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        const found = list.find((p) => String(p.id) === id || String(p.product_id) === id) || null;
        setProduct(found);

        // Auto-select first variant if only one exists
        if (found?.variants?.length === 1) {
          setSelected(found.variants[0]);
        }
      })
      .catch((err) => setError(err.message || "Failed to load product"))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className="center">Loading product…</div>;
  if (error) return <div className="center error">{error}</div>;
  if (!product) return <div className="center error">Product not found</div>;

  // Safe main image
  const mainImage: string = (() => {
    if (product.image) return product.image;
    const img = product.images?.[0];
    if (!img) return "/placeholder.png";
    return typeof img === "string" ? img : "url" in img && img.url ? `${API_BASE}${img.url}` : "/placeholder.png";
  })();

  const handleAdd = () => {
  if (product.variants && product.variants.length > 0 && !selected) {
    alert("Select a variant");
    return;
  }

  const uid = selected ? `${product.id}_${selected.id}` : `${product.id}`;
  const cartItem = {
    uid,
    productId: product.id,
    variantId: selected?.id ?? null,
    title: product.title || product.name || `Product ${product.id}`,
    price: selected?.price ?? product.price ?? 0,
    qty,
    image: mainImage,
  };

  // Get existing cart from localStorage
  const existing = JSON.parse(localStorage.getItem("cart") || "[]");
  // Check if item already exists
  const idx = existing.findIndex((item: any) => item.uid === uid);
  if (idx > -1) {
    existing[idx].qty += qty; // increase quantity
  } else {
    existing.push(cartItem);
  }
  localStorage.setItem("cart", JSON.stringify(existing));
  nav("/cart");
};

  return (
    <main className="container">
      <h1>{product.title || product.name || `Product ${product.id}`}</h1>
      <div className="details-grid">
        <div className="gallery">
          <img src={mainImage} alt={product.title || product.name} loading="lazy" />
          <div className="thumb-row">
            {product.images?.map((img, i) => {
              const src = typeof img === "string" ? img : "url" in img && img.url ? `${API_BASE}${img.url}` : "";
              return src ? <img key={i} src={src} alt={`thumb-${i}`} className="thumb" /> : null;
            })}
          </div>
        </div>

        <div>
          <p>{product.description}</p>

          {product.variants && product.variants.length > 0 && (
            <>
              <h2>Variants</h2>
              {(product.variants || []).map((v) => (
                <div
                  key={v.id}
                  className={`variant ${selected?.id === v.id ? "selected" : ""}`}
                  onClick={() => setSelected(v)}
                >
                  {v.name || `Variant ${v.id}`} - Rs. {v.price ?? product.price ?? 0}
                </div>
              ))}
            </>
          )}

          <div style={{ marginTop: "12px" }}>
            <label>
              Quantity:{" "}
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </label>
          </div>

          <button className="btn-primary" style={{ marginTop: "12px" }} onClick={handleAdd}>
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
