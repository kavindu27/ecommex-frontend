// src/components/ProductCard.tsx
import { Link } from "react-router-dom";
import type { Product } from "../types";

type Props = { product: Product };

const ProductCard: React.FC<Props> = ({ product }) => {
const image = product.image
  ? `https://evaluate.ecommexserver.site${product.image}`
  : product.images?.[0]
  ? `https://evaluate.ecommexserver.site${product.images[0]}`
  : "/placeholder.png";

<img src={image} alt={product.title || product.name} />

  const title = product.title || product.name || `Product ${product.id}`;
  const price = product.price ?? product.variants?.[0]?.price ?? 0;

  return (
    <article className="card">
      <Link to={`/product/${product.id || product.product_id}`}>
        <div className="card-media">
          <img src={image} alt={title} loading="lazy" />
        </div>
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <div className="card-price">Rs. {price}</div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
