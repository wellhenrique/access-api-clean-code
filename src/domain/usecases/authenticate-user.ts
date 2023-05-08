import { User } from "../user";

export interface AuthenticateUserDTO {
  email: string;
  password: string;
  userId?: string;
}

export interface ValidateProvidedPasswordProps {
  password: string;
  user: User;
}