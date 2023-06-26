/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private configService : ConfigService){
        super({
            datasources : {
                db : {
                    url : configService.get('DATABASE_URL'),
                }      
            },
        })
    }

    clearDb(){
        return this.$transaction([
            this.bootmark.deleteMany(),
            this.user.deleteMany(),
        ])
    }
}
