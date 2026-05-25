import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { PermissionName, Role, RoleName } from './permission.entity';

@Injectable()
export class PermissionService {
  constructor() {
    // @InjectRepository(Role)
    // roleRepository: Repository<Role>,
  }
  hasRole(
    user: User,
    roleName: RoleName,
    { failIfRejected }: { failIfRejected?: boolean } = { failIfRejected: true },
  ): boolean {
    const allowed = user.role.name === roleName;
    if (!allowed && failIfRejected)
      throw new InternalServerErrorException(
        "You don't have permssion to take this action",
      );
    return allowed;
  }

  hasAnyRole(
    user: User,
    roleNames: Role[],
    { failIfRejected }: { failIfRejected?: boolean } = { failIfRejected: true },
  ): boolean {
    const allowed = roleNames.includes(user.role);
    if (!allowed && failIfRejected)
      throw new InternalServerErrorException(
        "You don't have permssion to take this action",
      );
    return allowed;
  }

  can(
    user: User,
    permissionName: PermissionName,
    { failIfRejected }: { failIfRejected?: boolean } = { failIfRejected: true },
  ): boolean {
    const allowed = user.role.permissions
      .map((p) => p.name)
      .includes(permissionName);
    if (!allowed && failIfRejected)
      throw new InternalServerErrorException(
        "You don't have permssion to take this action",
      );
    return allowed;
  }
}
