import { Role } from '../roles/interface';

export interface User {
  id: string;
  createdTimestamp: number;
  username: string;
  enabled: boolean;
  totp: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  email: string;
  attributes: {
    code?: string[];
    phone?: string[];
    country?: string[];
    gender?: string[];
  };
  disableableCredentialTypes: string[];
  requiredActions: string[];
  notBefore: number;
  access: {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
  };
  roles: Array<Role>;
}

export type Users = User[];

export interface SerialUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  enabled: boolean;
  emailVerified: boolean;
  phone: string;
  country: string;
  gender: string;
  role: {
    id: string;
    name: string;
  };
  currentLanguage: string;
}

export interface UserResponse {
  mesage: string;
  user: SerialUser;
}
export type ResetRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  newPassword: string;
  confirmPassword: string;
  token: string;
};
