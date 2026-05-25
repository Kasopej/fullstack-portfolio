import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role } from './permission.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Role, Permission])],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
