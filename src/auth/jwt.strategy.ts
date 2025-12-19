import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')!,
        });

        // super({
        //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        //     ignoreExpiration: false,
        //     secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret_key',
        // });
    }

    // The payload is the decoded JWT (e.g., { sub: 1, email: 'admin@...' })
    async validate(payload: any) {
        // Whatever you return here becomes 'req.user' in your controllers
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}