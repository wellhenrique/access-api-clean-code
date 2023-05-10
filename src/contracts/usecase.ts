import { AuthenticateUserDTO } from "@/domain/usecases/authenticate-user";
import { User } from "@/domain/user";

export interface UseCase<Input, Output> {
  exec(params?: Input): Output
}

export type ValidateUser = UseCase<AuthenticateUserDTO, Promise<User>>;

export type generateTokenTypes = 'user' | 'driver' | 'company' | 'shipperInvite' | 'never-expire' | 'integration' | 'refreshToken'

export interface CreateNewSessionInput {
  user: User;
  tokenType: generateTokenTypes
}

export interface CreateNewSessionOutput {
  accessToken: string;
  token: string;
}

export type CreateNewSession = UseCase<CreateNewSessionInput, Promise<CreateNewSessionOutput>>

export type GetTokenTypeUserInput = User & {
  neverExpire?: boolean;
  cnpj?: string;

}
export type GetTokenType = UseCase<GetTokenTypeUserInput, Promise<generateTokenTypes>>
