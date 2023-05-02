import { UseCase } from "@/contracts";
import { AuthenticateUserDTO } from "@/domain/usecases/authenticate-user.dto";
import { MissingDomainParamError } from "../errors/missing-domain-param";

export class AuthenticateUserUseCase implements UseCase<AuthenticateUserDTO, Promise<void>> {
  async exec(props: AuthenticateUserDTO): Promise<void> {
    console.log('props: ', props)
    if(!props?.email) throw new MissingDomainParamError('email');
    
    return Promise.resolve();
  }
}