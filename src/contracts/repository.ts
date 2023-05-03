import { User } from "@/domain/user"

export interface Repository<Input, Output> {
  handle(params?: Input): Output
}

export type GetUserByEmailRepository = Repository<string, Promise<User | undefined>>