import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../../utils/constants';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      params: {
        apikey: apiKey,
      },
    });
  }

  async get(endpoint: string, params?: any) {
    return this.client.get(endpoint, { params });
  }

  async post(endpoint: string, data?: any) {
    return this.client.post(endpoint, data);
  }

  async put(endpoint: string, data?: any) {
    return this.client.put(endpoint, data);
  }

  async delete(endpoint: string) {
    return this.client.delete(endpoint);
  }
}

export const ticketmasterClient = new ApiClient(
  API_CONFIG.TICKETMASTER_BASE_URL,
  API_CONFIG.TICKETMASTER_API_KEY
);