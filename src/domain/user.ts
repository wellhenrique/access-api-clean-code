export interface User {
  email: string;
  password: string;
  temporaryPassword?: string;
  phoneNumber: string;
  disabled: boolean;
  id: string;
}