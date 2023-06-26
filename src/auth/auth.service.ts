/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from  'argon2'; 
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import {JwtService} from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    constructor(
        private prismaService :PrismaService,
        private jwt : JwtService,
        private configService : ConfigService
        ){}

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
            // delete user.hash;

            return this.signToken(user.id , user.email);
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
        // delete user.hash
        return this.signToken(user.id , user.email) ; 
    }

    async signToken(userId :number , email : string , ) :Promise<{access_token : string}> {
        // data that we well convert to token
        const payload = {
            sub : userId , 
            email , 
        }
        // get the secret from .env using config module
        const secret  = this.configService.get("JWT_SECRET");
        const token = await this.jwt.signAsync(
            payload , 
            {
                expiresIn : '15m' , 
                secret : secret , 

            }
        ) ; 
        return {
            access_token : token
        } ; 
    }
}