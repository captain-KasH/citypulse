export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TicketmasterResponse {
  _embedded?: {
    events: any[];
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface SearchParams {
  keyword?: string;
  city?: string;
  size?: number;
  page?: number;
}