import { Link } from "react-router-dom";
import type { Products } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || "https://evaluate.ecommexserver.site";

type Props = { product: Products };

const ProductCard = ({ product }: Props) => {
  const getImage = (): string => {
    // Cover image
    if (product.cover_image) {
      return product.cover_image.startsWith("http")
        ? product.cover_image
        : `${API_BASE}/${product.cover_image.replace(/^\/+/, '')}`;
    }

    // Additional images
    if (product.additional_images) {
      const first = product.additional_images.split(",")[0];
      return first.startsWith("http")
        ? first
        : `${API_BASE}/${first.replace(/^\/+/, '')}`;
    }

    // Placeholder
    return "/placeholder.png";
  };

  const image = getImage();
  const title = product.title || product.name || `Product ${product.id}`;
  const price = product.price ?? product.variants?.[0]?.price ?? 0;

  return (
    <article className="card">
      <Link to={`/products/${product.id || product.product_id}`}>
        <div className="card-media">
          <img src={image} alt={title} loading="lazy" />
        </div>

        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <div className="card-price">Rs. {price}</div>

          <div className="variant-chips">
            {(product.variants || []).slice(0, 3).map((v) => (
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
