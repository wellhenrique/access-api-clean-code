import { AuthenticateUserDTO } from "@/domain/usecases/authenticate-user.dto";
import { MissingDomainParamError } from "../errors/missing-domain-param";
import {faker} from '@faker-js/faker'
import { AuthenticateUserUseCase } from ".";
import { UserNotFoundError } from "../errors/user-not-found";
import { Repository } from "@/contracts/repository";
import { User } from "@/domain/user";

const usersInMemory: User[] = [];

class GetUserByEmailRepositoryStub implements Repository<string, Promise<User | undefined>> {
  async handle(email: string): Promise<User | undefined> {
    const user = usersInMemory.find(user => user?.email === email);
    return user;
  }
  
}

const makeFakeUser = () => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

const makeSut = () => {
  const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
  const authenticateUserUseCaseSpy = new AuthenticateUserUseCase(getUserByEmailRepositoryStub)
  return { authenticateUserUseCaseSpy }
}

describe('AuthenticateUserUseCase', () => {
  it('should be an AuthenticateUser instance', () => {
    const { authenticateUserUseCaseSpy } = makeSut();

    expect(authenticateUserUseCaseSpy).toBeInstanceOf(AuthenticateUserUseCase)
  })

  it("should return throw MissingDomainParamError when user email isn't provided", async () => {
    const { authenticateUserUseCaseSpy } = makeSut();
    const  { email, ...props} = makeFakeUser();

    const response = authenticateUserUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new MissingDomainParamError('email'));
  })

  it("should return throw MissingDomainParamError when user password isn't provided", async () => {
    const { authenticateUserUseCaseSpy } = makeSut();
    const  { password, ...props} = makeFakeUser();

    const response = authenticateUserUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new MissingDomainParamError('password'));
  })

  
  it("should return throw UserNotFoundError when user doesn't exist ", async () => {
    const { authenticateUserUseCaseSpy } = makeSut();
    const  fakeProps = makeFakeUser();

    const props = {
      ...fakeProps,
      email: 'invalidEmail@mail.com'
    }

    const response = authenticateUserUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new UserNotFoundError());
  })
})