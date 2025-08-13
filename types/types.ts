export interface Committee {
  id: string;
  name: string;
}

export interface Country {
  id: string;
  name: string;
  committee_id: string;
}

export interface User {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  is_internal: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface InternalRegistration {
  user_id: string;
  roll_number: string;
  college_id_photo_url: string;
  delegate_experience_doc_url: string;
  payment_id: string;
  payment_proof_url: string;
  created_at: string;
  bank_name: string;
  bank_branch: string;
  payment_date: string;
  users: User;
}

export interface ExternalRegistration {
  user_id: string;
  residential_address: string;
  residential_pincode: string;
  university_name: string;
  university_address: string;
  university_pincode: string;
  id_proof_url: string;
  accomodation_required: boolean;
  delegation_type: string;
  delegation_name: string | null;
  is_head_of_delegation: boolean | null;
  delegation_sheet_url: string | null;
  delegate_experience_doc_url: string;
  payment_id: string;
  payment_proof_url: string;
  created_at: string;
  bank_name: string;
  bank_branch: string;
  payment_date: string;
  users: User;
}

export interface DelegateCountryPreference {
  user_id: string;
  preference_order: number;
  country_order: number;
  country_id: string;
}

export interface IPCommitteePreferences {
  user_id: string;
  preference_order: number;
  committee_order: number;
  committee_id: string;
}

export interface UserPreference {
  user_id: string;
  preference_order: number;
  role: 'delegate' | 'IP';
  ip_subrole: string | null;
  committee_id: string | null;
  delegate_country_preferences: DelegateCountryPreference[];
  ip_committee_preferences: IPCommitteePreferences[];
}

export interface Allocation {
  user_id: string;
  role: 'delegate' | 'IP';
  ip_subrole: string | null;
  committee_id: string | null;
  country_id: string | null;
  allocated_at: string;
}

export interface UserWithData {
  user_id: string;
  name: string;
  phone_number: string;
  email: string;
  is_internal: boolean;
  preferences: UserPreference[];
  allocation: Allocation | null;
  // Internal registration fields
  roll_number?: string;
  college_id_photo_url?: string;
  delegate_experience_doc_url?: string;
  payment_id?: string;
  payment_proof_url?: string;
  bank_name?: string;
  bank_branch?: string;
  payment_date?: string;
  // External registration fields
  residential_address?: string;
  residential_pincode?: string;
  university_name?: string;
  university_address?: string;
  university_pincode?: string;
  id_proof_url?: string;
  accomodation_required?: boolean;
  delegation_type?: string;
  delegation_name?: string | null;
  is_head_of_delegation?: boolean | null;
  delegation_sheet_url?: string | null;
}