import { AuthenticateUserDTO } from "@/domain/usecases/authenticate-user.dto";

export interface UseCase<Input, Output> {
  exec(params?: Input): Output
}

export type AuthenticateUser = UseCase<AuthenticateUserDTO, Promise<void>>;