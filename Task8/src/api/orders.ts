import apiClient from "./client";

export interface OrderProduct {
  productId: string;
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

export interface CreateOrderData {
  customer_name: string;
  products: OrderProduct[];
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
    invoiceEmail: string;
    emailJobId: string;
  };
  meta: null;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
  meta: {
    total: number;
  };
}

export const createOrder = async (
  orderData: CreateOrderData,
): Promise<CreateOrderResponse> => {
  const response = await apiClient.post<CreateOrderResponse>(
    "/orders",
    orderData,
  );

  return response.data;
};

export const getOrders = async (): Promise<OrdersResponse> => {
  const response = await apiClient.get<OrdersResponse>("/orders");

  return response.data;
};