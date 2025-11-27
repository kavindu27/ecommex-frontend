// src/pages/Home.tsx
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import type { Products } from "../types";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://evaluate.ecommexserver.site";

export default function Home() {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    // session cache key
    const key = "products_store_4";
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        // 5 min cache
        if (Date.now() - parsed.ts < 5 * 60 * 1000) {
          setProducts(parsed.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    axios
      .get(`${API_BASE}/api/v2/products/all/variant?store_id=4`, { timeout: 10000 })
      .then((res) => {
        const list: Products[] = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        if (!mounted) return;
        setProducts(list);
        try {
          sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: list }));
        } catch {}
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch products");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="center">Loading products…</div>;
  if (error) return <div className="center error">Error: {error}</div>;

  return (
    <main className="container">
      <h1 className="page-title">Products</h1>
      <section className="grid">
        {products.map((p) => <ProductCard key={p.id || p.product_id} product={p} />)}
      </section>
    </main>
  );
}
