import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { createUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    async createUser(dto:createUserDto) {
        const user = await this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        })
        if(user) throw new ConflictException("Email Already Exist")
        const newUser = await this.prisma.user.create({
            data:{
                ...dto,
                password: await hash(dto.password,10),
            }
        })
        const {password,...result} = newUser
        return result;
    }
    async getUserByEmail(email:string){
        return await this.prisma.user.findUnique({
            where:{
                email:email
            }
        })
    }
    async getUserById(id:number){
        return await this.prisma.user.findUnique({
            where:{
                id:id
            }
        })
    }
}
