export interface Dataset {
  id: string;
  name: string;
  size: number;
  created_at: string;
  description?: string;
}

export interface Token {
  id: string;
  name: string;
  datasets: Dataset[];
  created_at: string;
  expires_at?: string;
  is_active: boolean;
  last_used?: string;
}

export interface CreateTokenRequest {
  name: string;
  dataset_ids: string[];
  expires_at?: string;
}

export interface CreateTokenResponse {
  id: string;
  token: string;
  name: string;
  datasets: Dataset[];
  created_at: string;
  expires_at?: string;
}

export interface TokenListResponse {
  tokens: Token[];
  count: number;
}

export interface DatasetListResponse {
  datasets: Dataset[];
  count: number;
}
