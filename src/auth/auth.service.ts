import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }
    async login(dto: LoginDto) {
        const user = await this.validateUser(dto)
        const payload = {
            email: user.email,
            sub: {
                name: user.name
            }
        }
        return {
            user,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '1h',
                    secret: process.env.jwtSecretKey
                }),
                refreshToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '7d',
                    secret: process.env.jwtRefreshTokenKey
                })
            }
        }
    }
    async validateUser(dto: LoginDto) {
        const user = await this.userService.getUserByEmail(dto.email)
        if (user && (await compare(dto.password, user.password))) {
            const { password, ...result } = user
            return user
        }
        throw new UnauthorizedException();

    }
    async refreshToken(user: any) {
        const payload = {
            email: user.email,
            sub: user.sub
        }
        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: '1h',
                secret: process.env.jwtSecretKey
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
                expiresIn: '7d',
                secret: process.env.jwtRefreshTokenKey
            })
        }

    }
}
