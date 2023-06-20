/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from  'argon2'; 
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime';
@Injectable()
export class AuthService {
    constructor(private prismaService :PrismaService){}

    async signup(dto: AuthDto) {
        try {
            // hash the password 
            const hash = await argon.hash(dto.password);
            // save the user 
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            });
            delete user.hash;

            return user;
        }catch(error) {
            if(error instanceof PrismaClientKnownRequestError){// if the error is a prisma error 
                if(error.code === 'P2002'){// "P2002" refers to a unique constraint violation.
                    throw new ForbiddenException("Credentials takens",);
                }
            }
            throw error ; 
        }
        
 
    }

    async signin(dto : AuthDto) {
        // find user by email 
        const user = await this.prismaService.user.findFirst({
            where:{
                email: dto.email,
            },
        });
        //if user not found 
        if(!user) {
            throw new ForbiddenException("credentials incorrect" , ) ; 
        }
        // verify the password
        const pwatchers =await argon.verify(user.hash , dto.password);
        // if the password is incorrect
        if(!pwatchers) throw new ForbiddenException("Credentials incorrect")

        // delete hashcode 
        delete user.hash
        return user ; 
    }
}