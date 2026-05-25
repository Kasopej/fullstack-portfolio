import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RoleName {
  ADMIN = 'admin',
  GUEST = 'guest',
}
@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleName,
    unique: true,
    nullable: false,
  })
  name: RoleName;

  @ManyToMany(() => Permission, (perm) => perm.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];
}

export enum PermissionName {}

@Entity({
  name: 'permissions',
})
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PermissionName,
    unique: true,
    nullable: false,
  })
  name: PermissionName;

  @ManyToMany(() => Role)
  roles: Role[];
}
