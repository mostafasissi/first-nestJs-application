import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // allow exporting prisma service on other module
})
export class PrismaModule {}
