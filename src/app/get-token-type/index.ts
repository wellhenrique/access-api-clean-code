import { GetTokenType, GetTokenTypeUserInput, UseCase, generateTokenTypes } from "@/contracts/usecase";

export class GetTokenTypeUseCase implements GetTokenType {
  exec(user: GetTokenTypeUserInput): Promise<generateTokenTypes> {
    if(user?.cnpj) return Promise.resolve('company');
    if(user?.neverExpire) return Promise.resolve('never-expire');

    return Promise.resolve('user');
  }
}
