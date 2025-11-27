import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Product, Variant, CartItem } from "../types";
import useCart from "../hooks/useCart";

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();
  const [mainImage, setMainImage] = useState("/placeholder.png");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://evaluate.ecommexserver.site/api/v2/products/all/variant?store_id=4`
        );
        const found = res.data.find((p: Product) => p.id === Number(id));
        if (found) {
          setProduct(found);
          if (found.variants?.length) setSelectedVariant(found.variants[0]);
          const firstImage = found.image || found.images?.[0] || null;
          setMainImage(firstImage ? `https://evaluate.ecommexserver.site${firstImage}` : "/placeholder.png");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const cartItem: CartItem = {
      uid: `${product.id}_${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      title: product.title || product.name || `Product ${product.id}`,
      price: selectedVariant.price ?? 0,
      qty: quantity,
      image: mainImage,
    };

    add(cartItem);
    alert("Added to cart!");
  };

  return (
    <div className="product-details">
      <div className="product-images">
        <img src={mainImage} alt={product.title || product.name} className="main-image" />
        <div className="thumbnail-images">
          {product.images?.map((img, index) => (
            <img
              key={index}
              src={`https://evaluate.ecommexserver.site${img}`}
              alt={product.title || product.name}
              className="thumbnail"
              onClick={() => setMainImage(`https://evaluate.ecommexserver.site${img}`)}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h1>{product.title || product.name}</h1>
        <p>{product.description}</p>

        <div className="variants">
          {product.variants?.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              className={v.id === selectedVariant?.id ? "active" : ""}
            >
              {v.name} - Rs. {v.price}
            </button>
          ))}
        </div>

        <div className="quantity">
          <label>Quantity:</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <button className="add-to-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Details;
