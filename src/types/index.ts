export type Variant = {
  id: number;
  name?: string;
  price?: number;
  [key: string]: any;
};

// Images can be a string URL or an object with url
export type ProductsImage = string | { url: string };

export type Products = {
  id: number;
  product_id?: number;
  name?: string;
  title?: string;
  description?: string;
  images?: ProductsImage[];
  image?: string;
  variants?: Variant[];
  price?: number;
  [key: string]: any;
};

export type CartItem = {
  uid: string;
  productId: number;
  variantId: number;
  title: string;
  price: number;
  qty: number;
  image?: string;
};
