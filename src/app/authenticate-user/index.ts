import { AuthenticateUserDTO } from "@/domain/usecases/authenticate-user.dto";
import { MissingDomainParamError } from "../errors/missing-domain-param";
import { UserNotFoundError } from "../errors/user-not-found";
import { GetUserByEmailRepository, AuthenticateUser, VerifyUserPasswordRepository, VerifyUserPasswordDTO } from "@/contracts";
import { User } from "@/domain/user";
import regex from "@/infra/utils/regex";
import { InvalidDomainParamError } from "../errors/invalid-domain-param";

export class AuthenticateUserUseCase implements AuthenticateUser {
  constructor(
    private getUserByEmailRepository: GetUserByEmailRepository,
    private verifyUserPasswordRepository: VerifyUserPasswordRepository,
  ) { }

  async exec(props: AuthenticateUserDTO): Promise<void> {
    if (!props?.email) throw new MissingDomainParamError('email');
    if (!props?.password) throw new MissingDomainParamError('password');

    await this.makeSureItsAValidEmail(props.email)

    const user = await this.getUserByEmail(props.email);
    await this.validadeProvidedPasswordWithUserPassword({
      password: props.password,
      userPassword: user.password
    });

    return Promise.resolve();
  }

  async makeSureItsAValidEmail(email: string) {
    const emailIsValid = regex.email.test(email);
    if (!emailIsValid) throw new InvalidDomainParamError('email');
  }

  async getUserByEmail(email: string) {
    const getUserByEmail = await this.getUserByEmailRepository.handle(email);
    if (!getUserByEmail) throw new UserNotFoundError()
    return getUserByEmail;
  }

  async validadeProvidedPasswordWithUserPassword(props: VerifyUserPasswordDTO) {
    const passwordProvidedIsValid = await this.verifyUserPasswordRepository.handle(props);
    if (!passwordProvidedIsValid) throw new InvalidDomainParamError('email or password');
  }
}