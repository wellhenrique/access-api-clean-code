import { AuthenticateUserDTO } from "@/domain/usecases/authenticate-user.dto";
import { MissingDomainParamError } from "../errors/missing-domain-param";
import { UserNotFoundError } from "../errors/user-not-found";
import { GetUserByEmailRepository, Repository } from "@/contracts/repository";
import { User } from "@/domain/user";
import regex from "@/infra/utils/regex";
import { InvalidDomainParamError } from "../errors/invalid-domain-param";
import { AuthenticateUser } from "@/contracts/usecase";

export class AuthenticateUserUseCase implements AuthenticateUser {
  constructor (
    private getUserByEmailRepository: GetUserByEmailRepository
  ) {}

  async exec(props: AuthenticateUserDTO): Promise<void> {
    if(!props?.email) throw new MissingDomainParamError('email');
    if(!props?.password) throw new MissingDomainParamError('password');

    await this.makeSureItsAValidEmail(props.email)

    const user = await this.getUserByEmail(props.email);

    return Promise.resolve();
  }

  async makeSureItsAValidEmail(email: string) {
    const emailIsValid = regex.email.test(email);
    if(!emailIsValid) throw new InvalidDomainParamError('email');
    return true;
  }

  async getUserByEmail(email: string): Promise<User> {
    const getUserByEmail = await this.getUserByEmailRepository.handle(email);
    if(!getUserByEmail) throw new UserNotFoundError()
    return getUserByEmail;
  }
}