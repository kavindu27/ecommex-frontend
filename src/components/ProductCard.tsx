// src/components/ProductCard.tsx
import { Link } from "react-router-dom";
import type { Products } from "../types";

type Props = { products: Products };

const ProductCard = ({ products }: Props) => {
  // Determine main image
  const image =
    typeof products.cover_image === "string"
      ? products.cover_image
      : products.cover_image?.url
      ? `https://evaluate.ecommexserver.site${products.cover_image.url}`
      : products.additional_images
      ? `https://evaluate.ecommexserver.site/${products.additional_images.split(",")[0]}`
      : "/placeholder.png";

  const title = products.title || products.name || `Product ${products.id}`;
  const price = products.price ?? products.variants?.[0]?.price ?? 0;

  return (
    <article className="card">
      <Link to={`/products/${products.id || products.product_id}`}>
        <div className="card-media">
          <img src={image} alt={title} loading="lazy" />
        </div>

        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <div className="card-price">Rs. {price}</div>

          <div className="variant-chips">
            {(products.variants || []).slice(0, 3).map((v) => (
              <span key={v.id} className="chip">
                {v.name || `v${v.id}`}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
