import { UseCase } from "@/contracts"

class AuthenticateUserUseCase implements UseCase<void, Promise<void>> {
  exec(): Promise<void> {
    return Promise.resolve();
  }
}

const makeSut = () => {
  const authenticateUserUseCaseSpy = new AuthenticateUserUseCase()
  return { authenticateUserUseCaseSpy }
}


describe('AuthenticateUserUseCase', () => {
  it('should be an AuthenticateUser instance', () => {
    const { authenticateUserUseCaseSpy } = makeSut();

    expect(authenticateUserUseCaseSpy).toBeInstanceOf(AuthenticateUserUseCase)
  })
})