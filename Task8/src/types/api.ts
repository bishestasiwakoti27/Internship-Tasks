export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  product_type: string;
  image?: string;
  store?: string | Store;
  createdAt?: string;
  updatedAt?: string;
}
export interface Store {
  _id: string;
  name: string;
  logo?: string;
  type: "Electronics" | "Grocery" | "Clothing" | "Stationery";
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  user: string | User;
  distance?: number;
}

export interface OrderProduct {
  productId: string | Product;
  quantity: number;
}

export interface Order {
  _id: string;
  customer_name: string;
  products: OrderProduct[];
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
export interface AuthResponse {
  message: string;
  token: string;
}
