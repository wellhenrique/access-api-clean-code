import { AuthenticateUserDTO } from "@/domain/usecases/authenticate-user.dto";
import { MissingDomainParamError } from "../errors/missing-domain-param";
import {faker} from '@faker-js/faker'
import { AuthenticateUserUseCase } from ".";
import { UserNotFoundError } from "../errors/user-not-found";
import { GetUserByEmailRepository, VerifyUserPasswordDTO, VerifyUserPasswordRepository } from "@/contracts";
import { User } from "@/domain/user";
import { InvalidDomainParamError } from "../errors/invalid-domain-param";

const usersInMemory: User[] = [];

class GetUserByEmailRepositoryStub implements GetUserByEmailRepository {
  async handle(email: string): Promise<User | undefined> {
    const user = usersInMemory.find(user => user?.email === email);
    return user;
  }
}

class VerifyUserPasswordRepositoryStub implements VerifyUserPasswordRepository {
  handle({ password, userPassword }: VerifyUserPasswordDTO): Promise<boolean> {
    return Promise.resolve(password === userPassword);
  }
}

const makeFakeUser = () => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

const makeSut = () => {
  const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
  const verifyUserPasswordRepositoryStub = new VerifyUserPasswordRepositoryStub();

  const authenticateUserUseCaseSpy = new AuthenticateUserUseCase(
    getUserByEmailRepositoryStub,
    verifyUserPasswordRepositoryStub
  )
  
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

  it("should return throw InvalidDomainParamError when user.email is invalid", async () => {
    const { authenticateUserUseCaseSpy } = makeSut();
    const fakeProps = makeFakeUser();

    const props = {
      ...fakeProps,
      email: 'invalidEmail'
    }

    const response = authenticateUserUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new InvalidDomainParamError('email'));
  })

  it("should return throw UserNotFoundError when user doesn't exist", async () => {
    const { authenticateUserUseCaseSpy } = makeSut();
    const  fakeProps = makeFakeUser();

    const props = {
      ...fakeProps,
      email: 'invalidEmail@mail.com'
    }

    const response = authenticateUserUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new UserNotFoundError());
  })

  it("should return throw InvalidDomainParamError if the provided password is not match from the user's password", async () => {
    const { authenticateUserUseCaseSpy } = makeSut();
    const  fakeProps = makeFakeUser();
    usersInMemory.push(fakeProps);

    const props = {
      ...fakeProps,
      password: 'invalidPassword'
    }

    const response = authenticateUserUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new InvalidDomainParamError('email or password'));
  })
})