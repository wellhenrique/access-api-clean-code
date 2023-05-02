import { UseCase } from "@/contracts";
import { AuthenticateUserDTO } from "@/domain/usecases/authenticate-user.dto";
import { MissingDomainParamError } from "../errors/missing-domain-param";

export class AuthenticateUserUseCase implements UseCase<AuthenticateUserDTO, Promise<void>> {
  async exec(props: AuthenticateUserDTO): Promise<void> {
    if(!props?.email) throw new MissingDomainParamError('email');
    if(!props?.password) throw new MissingDomainParamError('password');
    
    return Promise.resolve();
  }
}