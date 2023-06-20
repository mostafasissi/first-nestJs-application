/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(){
        super({
            datasources : {
                db : {
                    url : 'postgresql://postgres:123@192.168.43.198:5434/nest?schema=public',
                }      
            },
        })
    }
}
