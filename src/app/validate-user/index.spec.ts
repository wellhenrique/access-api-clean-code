import { AuthenticateUserDTO } from "@/domain/usecases/authenticate-user";
import { MissingDomainParamError } from "../errors/missing-domain-param";
import {faker} from '@faker-js/faker'
import { ValidateUserUseCase } from ".";
import { UserNotFoundError } from "../errors/user-not-found";
import { GetUserByEmailRepository, VerifyUserPasswordDTO, VerifyUserPasswordRepository } from "@/contracts";
import { User } from "@/domain/user";
import { InvalidDomainParamError } from "../errors/invalid-domain-param";
import { UserDisabledError } from "../errors/user-disabled-error";

const usersInMemory: User[] = [];

class GetUserByEmailRepositoryStub implements GetUserByEmailRepository {
  async handle(email: string): Promise<User | null> {
    const user = usersInMemory.find(user => user?.email === email);
    if(!user) return null;

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
  password: faker.internet.password(),
})

const makeSut = () => {
  const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
  const verifyUserPasswordRepositoryStub = new VerifyUserPasswordRepositoryStub();

  const userValidatorUseCaseSpy = new ValidateUserUseCase(
    getUserByEmailRepositoryStub,
    verifyUserPasswordRepositoryStub
  )
  
  return { userValidatorUseCaseSpy }
}

describe('UserValidatorUseCase', () => {
  it('should be an AuthenticateUser instance', () => {
    const { userValidatorUseCaseSpy } = makeSut();

    expect(userValidatorUseCaseSpy).toBeInstanceOf(ValidateUserUseCase)
  })

  it("should return throw MissingDomainParamError when user email isn't provided", async () => {
    const { userValidatorUseCaseSpy } = makeSut();
    const  { email, ...props} = makeFakeUser();

    const response = userValidatorUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new MissingDomainParamError('email'));
  })

  it("should return throw MissingDomainParamError when user password isn't provided", async () => {
    const { userValidatorUseCaseSpy } = makeSut();
    const  { password, ...props} = makeFakeUser();

    const response = userValidatorUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new MissingDomainParamError('password'));
  })

  it("should return throw InvalidDomainParamError when user.email is invalid", async () => {
    const { userValidatorUseCaseSpy } = makeSut();
    const {email, ...fakeProps} = makeFakeUser();

    const props = {
      ...fakeProps,
      email: 'invalidEmail'
    }

    const response = userValidatorUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new InvalidDomainParamError('email'));
  })

  
  it("should return throw UserDisabledError when user is disabled", async () => {
    const { userValidatorUseCaseSpy } = makeSut();
    const fakeProps = makeFakeUser();
    usersInMemory.push({
      ...fakeProps,
      disabled: true
    });

    const props = {
      ...fakeProps,
      password: fakeProps.password,
    }

    const response = userValidatorUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new UserDisabledError());
  })

  it("should return throw UserNotFoundError when user doesn't exist", async () => {
    const { userValidatorUseCaseSpy } = makeSut();
    const  fakeProps = makeFakeUser();

    const props = {
      ...fakeProps,
      email: 'invalidEmail@mail.com'
    }

    const response = userValidatorUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new UserNotFoundError());
  })

  it("should return throw InvalidDomainParamError if the provided password is not match from the user password", async () => {
    const { userValidatorUseCaseSpy } = makeSut();
    const fakeProps = makeFakeUser();
    usersInMemory.push({
      ...fakeProps,
      disabled: false
    });

    const props = {
      ...fakeProps,
      password: 'invalidPassword'
    }

    const response = userValidatorUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new InvalidDomainParamError('email or password'));
  })
  
  it("should return throw InvalidDomainParamError if the provided password is not match from the user temporary password", async () => {
    const { userValidatorUseCaseSpy } = makeSut();
    const  fakeProps = makeFakeUser();
    usersInMemory.push({
      ...fakeProps,
      temporaryPassword: faker.internet.password(),
      disabled: false
    });

    const props = {
      ...fakeProps,
      password: 'invalidPassword'
    }

    const response = userValidatorUseCaseSpy.exec(props as AuthenticateUserDTO);

    await expect(response).rejects.toThrow(new InvalidDomainParamError('email or password'));
  })  
})