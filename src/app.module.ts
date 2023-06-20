/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import {  } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
  
    AuthModule, 
    PrismaModule,
    
  ],
})
export class AppModule {}
