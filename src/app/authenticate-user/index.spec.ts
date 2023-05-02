import { AuthenticateUserDTO } from "@/domain/usecases/authenticate-user.dto";
import { MissingDomainParamError } from "../errors/missing-domain-param";
import {faker} from '@faker-js/faker'
import { AuthenticateUserUseCase } from ".";

const makeSut = () => {
  const authenticateUserUseCaseSpy = new AuthenticateUserUseCase()
  return { authenticateUserUseCaseSpy }
}

const makeFakeUser = () => ({
  email: faker.internet.email()
})

describe('AuthenticateUserUseCase', () => {
  it('should be an AuthenticateUser instance', () => {
    const { authenticateUserUseCaseSpy } = makeSut();

    expect(authenticateUserUseCaseSpy).toBeInstanceOf(AuthenticateUserUseCase)
  })

  it("should return throw MissingParamError when user email isn't provided", async () => {
    const { authenticateUserUseCaseSpy } = makeSut();
    const  { email, ...props} = makeFakeUser();

    const response = authenticateUserUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new MissingDomainParamError('email'));
  })
})