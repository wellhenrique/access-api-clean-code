import { User } from "@/domain/user"

export interface Repository<Input, Output> {
  handle(params?: Input): Output
}

export type GetUserByEmailRepository = Repository<string, Promise<User | undefined>>

export type VerifyUserPassword = {
  password: string;
  userPassword: string;
}
export type VerifyUserPasswordRepository = Repository<VerifyUserPassword, Promise<boolean>>