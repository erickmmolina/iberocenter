export interface UserFormData {
  name: string;
  email: string;
  password: string;
}

export interface CompanyFormData {
  name: string;
  tax_id: string;
}

export type OnboardingStep = 'user' | 'company';

export interface OnboardingState {
  step: OnboardingStep;
  userData: UserFormData;
  companyData: CompanyFormData;
}