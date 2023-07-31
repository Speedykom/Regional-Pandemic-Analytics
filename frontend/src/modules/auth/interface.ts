export type Permissions = Array<{
  name: string;
  scopes: string[];
}>;

export type LoginParams = {
  username: string;
  password: string;
};

export type Credentials = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
  permissions: Permissions;
};


export interface JwtInfos {
  realm_access: {
    roles: string[];
  };
  resource_access: Record<
    string,
    {
      roles: string[];
    }
  >;
  email_verified: boolean;
  preferred_username: string;
  avatar: string;
  given_name: string;
  family_name: string;
  email: string;
  gender?: string;
}

export interface Jwt extends JwtInfos {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  scope: string;
  sid: string;
}

export interface UserProfile extends JwtInfos {
  id: string;
  country?: string;
  gender?: string;
  phone?: string;
  code?: string;
  name?: string;
}