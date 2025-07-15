export interface AuthData {
  token: string;
  expiresAt: number;
  profile?: UserProfile;
  refreshToken?: string;
}

export interface UserProfile {
  provider: boolean;
  merchant: boolean;
  client: boolean;
  deliveryman: boolean;
}

export interface Shipment {
  shipment_id: string;
  description: string;
  estimated_total_price: string;
  proposed_delivery_price: string;
  weight: string;
  volume: string;
  deadline_date: string;
  time_slot: string | null;
  urgent: boolean;
  status: string;
  image: string;
  views: number;
  departure_city: string;
  arrival_city: string;
  departure_address: string;
  arrival_address: string;
  departure_postal: string;
  arrival_postal: string;
  covered_steps: number[];
}

export interface Service {
  service_id: string;
  service_type: string;
  status: string;
  name: string;
  city: string;
  price: string;
  price_admin: string | null;
  duration_time: number;
  available: boolean;
  keywords: string[];
  images: string[];
  description: string;
  author: {
    id: string;
    name: string;
    email: string;
    photo: string;
  };
  rate: number;
  comments: any[][];
}

export interface ApiResponse<T> {
  data?: T[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo: string | null;
  active: boolean;
  language: string;
  iso_code: string;
  profile: string[];
  otp?: boolean | false;
  updgradablePlan?: boolean | false;
  planName?: string;
  validateProfile?: boolean | false;
}
