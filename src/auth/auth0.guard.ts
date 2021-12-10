import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'util';
import * as jwt from 'express-jwt';
// import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Auth0Guard implements CanActivate {
  private readonly AUTH0_DOMAIN: string;
  private readonly AUTH0_AUDIENCE: string;

  constructor(private readonly configService: ConfigService) {
    this.AUTH0_AUDIENCE = configService.get('AUTH0_AUDIENCE');
    this.AUTH0_DOMAIN = configService.get('AUTH0_DOMAIN');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [request, response, next] = context.getArgs();

    const checkJwt = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 4,
          jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        }),
        audience: this.AUTH0_AUDIENCE,
        issuer: this.AUTH0_DOMAIN,
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJwt(request, response);
      return true;
    } catch (err) {
      Logger.log('Token check resulted in error.', err);
      throw new UnauthorizedException(err);
    }
  }
}
