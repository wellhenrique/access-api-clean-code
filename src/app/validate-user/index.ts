import { AuthenticateUserDTO, ValidateProvidedPasswordProps } from "@/domain/usecases/authenticate-user";
import { MissingDomainParamError } from "../errors/missing-domain-param";
import { UserNotFoundError } from "../errors/user-not-found";
import { GetUserByEmailRepository, ValidateUser, VerifyUserPasswordRepository } from "@/contracts";
import regex from "@/infra/utils/regex";
import { InvalidDomainParamError } from "../errors/invalid-domain-param";
import { User } from "@/domain/user";
import { UserDisabledError } from "../errors/user-disabled-error";

export class ValidateUserUseCase implements ValidateUser {
  constructor(
    private getUserByEmailRepository: GetUserByEmailRepository,
    private verifyUserPasswordRepository: VerifyUserPasswordRepository,
  ) {}

  async exec(props: AuthenticateUserDTO): Promise<User> {
    const { email, password, userId } = props;

    if (!email) throw new MissingDomainParamError('email');
    if (!password) throw new MissingDomainParamError('password');
    await this.makeSureItsAValidEmail(props.email)

    let user = await this.getUserByEmail(props.email);
    if(!user && userId) {
      user = await this.getUserByUserID(userId);
    }
    
    if(!user) throw new UserNotFoundError()
    if(user?.disabled) throw new UserDisabledError();

    await this.validateProvidedPasswordWithPasswordAndTempPassword({
      password: props.password,
      user,
    });

    return user;
  }

  async makeSureItsAValidEmail(email: string) {
    const emailIsValid = regex.email.test(email);
    if (!emailIsValid) throw new InvalidDomainParamError('email');
  }

  async getUserByEmail(email: string) {
    const getUserByEmail = await this.getUserByEmailRepository.handle(email);
    return getUserByEmail;
  }

  async getUserByUserID(userID: string) {
    const getUserByID = await this.getUserByEmailRepository.handle(userID);
    return getUserByID;
  }

  async validateProvidedPasswordWithPasswordAndTempPassword({
    password, 
    user
  }: ValidateProvidedPasswordProps) {
    const passwordProvidedIsValid = await this.verifyUserPasswordRepository.handle({
      password,
      userPassword: user.password
    });

    if (!passwordProvidedIsValid) {
      if(!user.temporaryPassword) throw new InvalidDomainParamError('email or password');

      const passwordProvidedMathTemporaryPassword = await this.verifyUserPasswordRepository.handle({
        password,
        userPassword: user.temporaryPassword
      });

      if(!passwordProvidedMathTemporaryPassword) 
        throw new InvalidDomainParamError('email or password');
    }
  }
}