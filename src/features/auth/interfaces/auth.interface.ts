export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface MerchantLoginFormData {
  workEmail: string;
  password: string;
}

export interface MerchantRegisterFormData {
  businessName: string;
  workEmail: string;
  password: string;
  confirmPassword: string;
  inviteCode: string;
}

export type UserRole = "consumer" | "merchant";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessName?: string;
}
