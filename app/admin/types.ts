export type Role = 'Reporter' | 'Photojournalist';
export type DelegateType = 'Delegate' | 'IP';

export interface Preference {
  type: DelegateType;
  role?: Role;
  committee?: string;
  countries?: string[];
}

export interface Delegate {
  id: number;
  name: string;
  email: string;
  phone: string;
  institution: string;
  internal: boolean;
  rollNumber?: string; // For internal
  address?: string; // For external
  pinCode?: string; // For external
  accommodationNeeded?: boolean; // For external
  isHeadDelegation?: boolean; // For external
  delegationName?: string; // For external
  uploads: {
    paymentProof: string;
    collegeId?: string; // For internal
    aadharId?: string; // For external
    delegateExperience?: string;
    delegationSheet?: string; // For external group delegation
  };
  preferences: Preference[];
  allocation: Allocation | null;
}

export interface Allocation {
  committee: string;
  country: string;
  role?: Role; // For IP allocations
}