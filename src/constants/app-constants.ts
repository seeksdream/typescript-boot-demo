import {PermissionConfig} from "typescript-boot";

export const SYS_INNER_ROLES = {
  SUPER_ADMIN_ROLE_ID: 'admin', // 超级管理员
  BRANCH_ADMIN_ROLE_ID: 'branch-admin', // 分支机构管理员
  SEARCH: 'search', // 查询用户
  MANAGER: 'manager', // 业务管理员
};

export const SuperAdminRequiredPermission: PermissionConfig = {
  login: true,
  roles: [SYS_INNER_ROLES.SUPER_ADMIN_ROLE_ID]
};
