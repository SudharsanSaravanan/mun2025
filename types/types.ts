export type Role = 'Reporter' | 'Photojournalist';
export type DelegateType = 'Delegate' | 'IP';

export type Committee = {
  id: string;
  name: string;
};

export type Country = {
  id: string;
  name: string;
  committee_id: string;
};

export type User = {
  user_id: string;
  type: 'Internal' | 'External';
  users: {
    id: string;
    name: string;
    email: string;
  };
};

export type Allocation = {
  user_id: string;
  role: 'delegate' | 'IP';
  ip_subrole?: string | null;
  committee_id?: string | null;
  country_id?: string | null;
};

export type Preference = {
  preference_order: number;
  role: 'delegate' | 'IP';
  ip_subrole?: string | null;
  committee_id?: string | null;
  committees?: {
    name: string;
  };
  delegate_country_preferences?: {
    country_order: number;
    country_id: string;
    countries: {
      name: string;
    };
  }[];
};

export type UserWithData = User & {
  preferences: Preference[];
  allocation: Allocation | null;
};

export type RegistrationSource =
  | { table: 'internal_registrations'; type: 'Internal' }
  | { table: 'external_registrations'; type: 'External' };
