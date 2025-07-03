export interface Dataset {
  id: string;
  name: string;
  size?: number;
  created_at?: string;
  description?: string;
}

export interface Token {
  user_id: string;
  allowed_objects: string[];
  created_at: string;
  is_revoked: boolean;
  description?: string;
}

export interface CreateTokenRequest {
  description?: string;
  allowed_objects: string[];
}

export interface CreateTokenResponse {
  token: string;
}

export interface TokenListResponse {
  tokens: Token[];
}

export interface DatasetListResponse {
  datasets: string[];
}
