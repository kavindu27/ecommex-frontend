export type Variant = {
  id: number;
  name?: string;
  price?: number;
  [key: string]: any;
};

export type Product = {
  id: number;
  product_id?: number;
  name?: string;
  title?: string;
  description?: string;
  image?: string;       // main image (string URL)
  images?: string[];    // array of string URLs
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
