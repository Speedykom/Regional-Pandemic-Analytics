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
