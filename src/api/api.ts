import axios from "axios";

const API = axios.create({
  baseURL: "https://evaluate.ecommexserver.site",
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------
// 1. GET Products Variant
// ----------------------
export const getProducts = async (storeId: number) => {
  const response = await API.get(`/api/v2/products/all/variant?store_id=${storeId}`);
  return response.data;
};

// ----------------------
// 2. POST Create Order
// ----------------------
export const createOrder = async (payload: any) => {
  const response = await API.post("/api/v2/orders/variants", payload);
  return response.data;
};

// ----------------------
// 3. PUT Update Order
// ----------------------
export const updateOrder = async (orderId: number, payload: any) => {
  const response = await API.put(`/api/v2/orders/variants/${orderId}`, payload);
  return response.data;
};
