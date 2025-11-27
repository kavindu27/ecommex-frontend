import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import type { Products } from "../types";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20); // items per page

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://evaluate.ecommexserver.site/api/v2/products/all/variant?store_id=4`
      )
      .then((res) => {
        setProducts(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const paginatedProducts = products.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const totalPages = Math.ceil(products.length / perPage);

  return (
    <div className="container">
      <h1>Products</h1>

      {loading && <p>Loading products...</p>}

      {!loading && (
        <>
          <div className="grid">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} products={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-primary"
                style={{ marginRight: 10 }}
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-primary"
                style={{ marginLeft: 10 }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
