import { UseCase } from "@/contracts";
import { AuthenticateUserDTO } from "@/domain/usecases/authenticate-user.dto";
import { MissingDomainParamError } from "../errors/missing-domain-param";
import { UserNotFoundError } from "../errors/user-not-found";
import { Repository } from "@/contracts/repository";
import { User } from "@/domain/user";

export class AuthenticateUserUseCase implements UseCase<AuthenticateUserDTO, Promise<void>> {
  constructor (
    private getUserByEmailRepository: Repository<string, Promise<User | undefined>>
  ) {}

  async exec(props: AuthenticateUserDTO): Promise<void> {
    if(!props?.email) throw new MissingDomainParamError('email');
    if(!props?.password) throw new MissingDomainParamError('password');

    const user = await this.getUserByEmail(props.email);
    return Promise.resolve();
  }

  async getUserByEmail(email: string): Promise<User> {
    const getUserByEmail = await this.getUserByEmailRepository.handle(email);
    if(!getUserByEmail) throw new UserNotFoundError()

    return getUserByEmail;
  }
}