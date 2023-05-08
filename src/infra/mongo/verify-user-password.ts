import { UserModel } from "./schema/user-schema";
import { VerifyUserPasswordDTO, VerifyUserPasswordRepository } from "@/contracts";

export class MongoDBVerifyUserPassword implements VerifyUserPasswordRepository {
  async handle({password, userPassword}: VerifyUserPasswordDTO): Promise<boolean> {
    return await UserModel.verifyPassword(password, userPassword);
  }
}