import { CreateNewSession, CreateNewSessionOutput, CreateNewSessionInput } from "@/contracts/usecase";
import { User } from "@/domain/user";
import jwt from "jsonwebtoken";
import envs from "@/infra/config/envs";
import { InvalidDomainParamError } from "../errors/invalid-domain-param";

type generateTokenProps = User & {
  refName?: string;
  driver?: any;
  cnpj?: string;
  takerCnpj?: string;
  admin?: boolean;
  ref?: string;
  invitation?: string;
}

interface TokenContent {
  email?: string;
  name?: string;
  phoneNumber?: string;
  cnpj?: string;
  admin?: boolean;
  companyId?: string;
  userId?: string;
  driver?: any;
  _id?: string;
  takerCnpj?: string;
  refName?: string;
  ref?: string;
  invitation?: string;
  tokenType: string;
}

export class CreateNewSessionUseCase implements CreateNewSession {
  async exec(params: CreateNewSessionInput): Promise<CreateNewSessionOutput> {
    const { tokenType, user } = params;

    const tokenContent = this.generateTokenContent(user, tokenType);
    const {  content, expiresIn } = this.getTokenConfig(tokenContent);

    const time = tokenContent.key || envs.securitySecretKey as unknown as jwt.Secret;
    const token = jwt.sign(tokenContent, time, {expiresIn });
    console.log('token: ', token);
    
    return Promise.resolve({ accessToken: '', token: ''})
  }

  private generateTokenContent(user: generateTokenProps, tokenType: string) {
    switch (tokenType) {
      case 'user': 
        return {
          email: user.email,
          phoneNumber: user.phoneNumber,
          admin: user.admin,
          tokenType: 'userToken',
          key: process.env.secretKey
        }
      case 'driver':
        return {
          phoneNumber: user.phoneNumber,
          tokenType: 'driverToken',
          driver: { ...user.driver },
        };
      case 'company':
        return {
          cnpj: user.cnpj,
          tokenType: 'companyToken'
        };
      case 'shipperInvite':
        return {
          takerCnpj: user.takerCnpj,
          tokenType: 'shipperInviteToken',
          name: user.refName,
          ref: user.ref,
          email: user.email,
          invitation: user.invitation,
        };
      case 'never-expire':
        return {
          tokenType: 'neverExpireToken',
        };
      case 'integration':
        return { 
          companyId: user.id,
          tokenType: 'integrationToken',
          key: process.env.integrationKey
         };
      case 'refreshToken':
        return {
          userId: user.id,
          email: user.email,
          tokenType: 'refreshToken'
        };
      default:
        throw new InvalidDomainParamError('tokenType');
    }
  }

  private getTokenConfig(content: TokenContent) {
    switch (content.tokenType) {
      case 'driver':
        return { content, expiresIn: 31536000 };
      case 'company':
        return { content, expiresIn: undefined };
      case 'shipperInvite':
        return { content, expiresIn: 31536000 };
      case 'never-expire':
        return { content, expiresIn: undefined };
      case 'integration':
        return { content, expiresIn: undefined };
      case 'refreshToken':
        return { content, expiresIn: envs.refreshTokenExpiry };
      default:
        throw new InvalidDomainParamError('tokenType');
    }
  }
}
