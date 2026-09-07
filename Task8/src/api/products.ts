import apiClient from "./client";

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  product_type: string;
  image?: string;
  store?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: PaginationMeta;
}

export const getProducts = async (
  page: number = 1,
  limit: number = 10,
): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>(
    `/products?page=${page}&limit=${limit}`,
  );

  return response.data;
};

export const searchProducts = async (
  search: string,
): Promise<Product[]> => {
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    data: Product[];
    meta: {
      total: number;
    };
  }>(`/products/search?search=${encodeURIComponent(search)}`);

  return response.data.data;
};
export const filterProductsByType = async (
  productType: string,
): Promise<Product[]> => {
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    data: Product[];
    meta: {
      total: number;
    };
  }>(
    `/products/filter/type?product_type=${encodeURIComponent(productType)}`,
  );

  return response.data.data;
};
export const sortProductsByPrice = async (
  order: "asc" | "desc",
): Promise<Product[]> => {
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    data: Product[];
    meta: {
      total: number;
    };
  }>(`/products/sort/price?order=${order}`);

  return response.data.data;
};