export interface Role {
  id: string;
  name: string;
  description: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
  attributes: any;
}

export type Roles = Array<Role>;
