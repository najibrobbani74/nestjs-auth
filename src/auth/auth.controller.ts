import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { createUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { RefreshJwtGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private userService:UserService,
        private authService:AuthService,
        ){}
    @Post('register')
    async register(@Body() dto:createUserDto){
        return this.userService.createUser(dto)
    }
    @Post("login")
    async login(@Body() dto:LoginDto){
        return this.authService.login(dto)
    }
    @UseGuards(RefreshJwtGuard)
    @Post("refresh")
    async refreshToken(@Request() req){
        return this.authService.refreshToken(req.user)
    }
}
