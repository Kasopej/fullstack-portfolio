import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { HashingProvider } from 'src/providers/hashing.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, HashingProvider],
  exports: [UserService],
})
export class UserModule {}
