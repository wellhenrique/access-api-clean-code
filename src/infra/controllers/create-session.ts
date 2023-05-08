import { ValidateUser } from "@/contracts"
import { CreateSession, RequestType } from "@/contracts/controller"
import { CreateNewSession } from "@/contracts/usecase";

export class CreateSessionController implements CreateSession {
  constructor(
    private readonly validateUserUseCase: ValidateUser,
    private readonly createNewSessionUseCase: CreateNewSession,
  ) {}

  async handle(params: RequestType): Promise<string> {
    try {
      const { email, password, tokenType } = params.request.body

      const user = await this.validateUserUseCase.exec({
        email,
        password
      })

      const { accessToken, token } = await this.createNewSessionUseCase.exec({user, tokenType});
      return accessToken;
    } catch (error) {
      return ''
    }
  }
}
