export interface DashboardList {
  count: number;
  description_columns: DescriptionColumns;
  ids: number[];
  label_columns: LabelColumns;
  list_columns: string[];
  list_title: string;
  order_columns: string[];
  result: DashboardListResult[];
}

export interface DescriptionColumns {}

export interface LabelColumns {
  certification_details: string;
  certified_by: string;
  'changed_by.first_name': string;
  'changed_by.id': string;
  'changed_by.last_name': string;
  'changed_by.username': string;
  changed_by_name: string;
  changed_by_url: string;
  changed_on_delta_humanized: string;
  changed_on_utc: string;
  'created_by.first_name': string;
  'created_by.id': string;
  'created_by.last_name': string;
  created_on_delta_humanized: string;
  css: string;
  dashboard_title: string;
  id: string;
  is_managed_externally: string;
  json_metadata: string;
  'owners.email': string;
  'owners.first_name': string;
  'owners.id': string;
  'owners.last_name': string;
  'owners.username': string;
  position_json: string;
  published: string;
  'roles.id': string;
  'roles.name': string;
  slug: string;
  status: string;
  thumbnail_url: string;
  url: string;
}

export interface DashboardListResult {
  certification_details: string;
  certified_by: string;
  changed_by: ChangedBy;
  changed_by_name: string;
  changed_by_url: string;
  changed_on_delta_humanized: string;
  changed_on_utc: string;
  created_by: CreatedBy;
  created_on_delta_humanized: string;
  css: string;
  dashboard_title: string;
  id: number;
  is_managed_externally: boolean;
  json_metadata: string;
  owners: Owner[];
  position_json: string;
  published: boolean;
  roles: any[];
  slug: any;
  status: string;
  thumbnail_url: string;
  url: string;
}

export interface ChangedBy {
  first_name: string;
  id: number;
  last_name: string;
  username: string;
}

export interface CreatedBy {
  first_name: string;
  id: number;
  last_name: string;
}

export interface Owner {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
}

export interface DashboardStatus {
  result: DashboardStatusResult;
}

export interface DashboardStatusResult {
  allowed_domains: string[];
  changed_by: ChangedBy;
  changed_on: string;
  dashboard_id: string;
  uuid: string;
}
