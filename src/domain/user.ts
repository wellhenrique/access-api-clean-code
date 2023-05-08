export interface User {
  email: string;
  password: string;
  temporaryPassword?: string;
  disabled: boolean;
}