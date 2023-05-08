import { GetUserByEmailRepository } from "@/contracts";
import { User } from "@/domain/user";
import { UserModel } from "./schema/user-schema";


export class MongoDBGetUserByEmail implements GetUserByEmailRepository {
  async handle(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if(!user) return null;

    return {
      email: user.email,
      password: user.password,
      temporaryPassword: user.temporaryPassword,
      disabled: user.disabled,
    };
  }
}