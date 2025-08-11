export interface Committee {
  id: string;
  name: string;
  is_double_delegation: boolean;
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
  bank_name: string;
  bank_branch: string;
  payment_date: string;
  created_at: string;
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
  delegation_type: 'individual' | 'group';
  delegation_name: string | null;
  is_head_of_delegation: boolean | null;
  delegation_sheet_url: string | null;
  delegate_experience_doc_url: string;
  payment_id: string;
  payment_proof_url: string;
  bank_name: string;
  bank_branch: string;
  payment_date: string;
  created_at: string;
}

export interface DelegateCountryPreference {
  user_id: string;
  preference_order: number;
  country_order: number;
  country_id: string;
  country?: Country; // Expanded country data
}

export interface IPCommitteePreference {
  user_id: string;
  preference_order: number;
  committee_order: number;
  committee_id: string;
  committee?: Committee; // Expanded committee data
}

export interface UserPreference {
  user_id: string;
  preference_order: number;
  role: 'delegate' | 'IP';
  ip_subrole: 'reporter' | 'photojournalist' | null;
  co_delegate_name: string | null;
  co_delegate_email: string | null;
  delegate_country_preferences: DelegateCountryPreference[];
  ip_committee_preferences: IPCommitteePreference[];
  // For expanded data in queries
  countries?: Array<{
    country_order: number;
    country_id: string;
    country: Country;
  }>;
  committees?: Array<{
    committee_order: number;
    committee_id: string;
    committee: Committee;
  }>;
}

export interface Allocation {
  user_id: string;
  role: 'delegate' | 'IP';
  ip_subrole: 'reporter' | 'photojournalist' | null;
  committee_id: string | null;
  country_id: string | null;
  is_double_delegation: boolean;
  allocated_at: string;
  committee?: Committee; // Expanded committee data
  country?: Country; // Expanded country data
}

export interface UserWithData extends User {
  internal_registrations: InternalRegistration | null;
  external_registrations: ExternalRegistration | null;
  preferences: UserPreference[];
  allocation: Allocation | null;
  registration: InternalRegistration | ExternalRegistration | null;
}

// Additional utility types
export type DelegationOptionType = 'individual' | 'group';
export type UserRoleType = 'delegate' | 'IP';
export type IPRoleType = 'reporter' | 'photojournalist';

// Type for the registration document URLs
export interface RegistrationDocuments {
  id_proof_url?: string;
  college_id_photo_url?: string;
  delegate_experience_doc_url: string;
  payment_proof_url: string;
  delegation_sheet_url?: string | null;
}

// Type for payment information
export interface PaymentInfo {
  payment_id: string;
  payment_date: string;
  bank_name: string;
  bank_branch: string;
}