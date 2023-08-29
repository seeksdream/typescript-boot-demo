import {apiDoc, dbColumnName} from 'typescript-boot';

@apiDoc('角色对象')
export class DemoRole{
  @apiDoc('角色名称')
  name:string;
  @apiDoc('角色编号')
  code:string;
  @apiDoc('角色说明')
  remark:string;
}

@apiDoc('角色对象VO')
export class DemoRoleVO{
  @apiDoc('角色名称')
  roleId:string;
  @apiDoc('角色编号')
  name:string;
  @apiDoc('角色说明')
  remark:string;
  @apiDoc('时间')
  createTime:string;
  @apiDoc('是否是内置角色')
  @dbColumnName('PRIORITY')
  innerRole:number;
}
