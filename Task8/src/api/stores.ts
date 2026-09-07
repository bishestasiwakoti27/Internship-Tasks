import apiClient from "./client";

export interface Store {
  _id: string;
  name: string;
  logo?: string;
  type: string;
  location: {
    type: string;
    coordinates: number[];
  };
  user?: string;
}

export interface StoresResponse {
  success: boolean;
  message: string;
  data: Store[];
  meta: {
    total: number;
    maxDistance?: number;
  };
}

export const getStores = async (): Promise<StoresResponse> => {
  const response = await apiClient.get<StoresResponse>("/stores");

  return response.data;
};

export const getNearbyStores = async (
  longitude: number,
  latitude: number,
): Promise<StoresResponse> => {
  const response = await apiClient.post<StoresResponse>(
    "/stores/nearby",
    {
      longitude,
      latitude,
    },
  );

  return response.data;
};