export interface Delegate {
  id: number;
  name: string;
  email: string;
  phone: string;
  institution: string;
  internal: boolean;
  uploads: { paymentProof: string };
  allocation: Allocation | null;
}

export interface Allocation {
  committee: string;
  country: string;
  position?: string;
}