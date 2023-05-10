import { GetTokenTypeUseCase } from "@/app/get-token-type";
import { Controller, HttpRequest, HttpResponse, ValidateUser } from "@/contracts"
import { CreateNewSession } from "@/contracts/usecase";
import { created } from "../helpers/http-helper";

export class CreateSessionController implements Controller {
  constructor(
    private readonly validateUserUseCase: ValidateUser,
    private readonly createNewSessionUseCase: CreateNewSession,
    private readonly getTokenTypeUseCase: GetTokenTypeUseCase,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password, neverExpire } = httpRequest.body

      const user = await this.validateUserUseCase.exec({
        email,
        password
      })

      const tokenType = await this.getTokenTypeUseCase.exec({
        ...user,
        neverExpire: !!neverExpire
      });

      const { accessToken, token } = await this.createNewSessionUseCase.exec({ user, tokenType });
      return created({accessToken: accessToken });
    } catch (error) {
      throw new Error();
    }
  }
}
