import { ValidateUserUseCase } from "@/app/validate-user"
import { MongoDBGetUserByEmail } from "../mongo/get-user-by-email";
import { MongoDBVerifyUserPassword } from "../mongo/verify-user-password";

export const makeValidateUser = () => {
  const getUserByEmailRepository = new MongoDBGetUserByEmail();
  const verifyUserPasswordRepository = new MongoDBVerifyUserPassword();
  return new ValidateUserUseCase(getUserByEmailRepository, verifyUserPasswordRepository);
}