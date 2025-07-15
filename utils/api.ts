import axios from "axios";
import type { Shipment, Service, ApiResponse, User } from "@/types/api";
import { AuthManager } from "@/utils/auth";

const BASE_URL = "http://localhost:3001";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AuthManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ApiClient {
  async fetchShipments(
    page = 1,
    limit = 10,
    filters?: Record<string, any>
  ): Promise<Shipment[]> {
    try {
      const params = {
        page,
        limit,
        ...filters,
      };

      const response = await axiosInstance.get<Shipment[]>(
        "/client/shipments",
        {
          params,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching shipments:", error);
      return [];
    }
  }

  async fetchServices(
    page = 1,
    limit = 10,
    search?: string,
    city?: string
  ): Promise<ApiResponse<Service>> {
    try {
      const params: Record<string, any> = {
        page,
        limit,
      };
      if (search) params.search = search;
      if (city) params.city = city;

      const response = await axiosInstance.get<ApiResponse<Service>>(
        "/client/service",
        { params }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      return { data: [], meta: { total: 0, page, limit } };
    }
  }

  async fetchUserProfile(): Promise<User> {
    try {
      const response = await axiosInstance.get<User>("/client/profile/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
