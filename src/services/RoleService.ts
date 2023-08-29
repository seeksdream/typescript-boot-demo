import {BaseService} from 'typescript-boot';
import {
  apiBodyAsParam,
  apiDoc, apiDocArrayItem,
  apiParamFromBody,
  apiPath,
  apiRequest,
  apiReturn
} from 'typescript-boot';
import {getDataBaseClient} from 'typescript-boot';
import {DemoRole, DemoRoleVO} from "./RoleObjects";





@apiDoc('角色管理系列接口')
@apiPath('/demo-role')
export class RoleService extends BaseService {
  @apiDoc('查询所有角色')
  @apiPath('query-roles')
  @apiDocArrayItem(DemoRoleVO)
  @apiReturn(Array)
  async queryRoles(@apiParamFromBody('角色id') id:string) {
    console.log('你输入的id是：', id);
    const sql = 'select * from SYS_ROLE where ROLE_ID=?';
    const list = await getDataBaseClient().getList<DemoRoleVO>(DemoRoleVO, sql, [id]);
    return this.success(list);
  }
  @apiDoc('添加角色')
  @apiPath('add-role')
  async addRole(@apiBodyAsParam() role:DemoRole) {
    console.log('params:', role.name);
    await getDataBaseClient().insertRow('SYS_ROLE', {
      ROLE_ID: role.code,
      NAME: role.name,
      REMARK: role.remark
    });
    // if (!name) {
    //   throw new Error('角色名称不能为空！');
    // }
    return this.success(true);
  }
  @apiDoc('更新角色')
  @apiPath('update-role')
  async updateRole(@apiBodyAsParam() role:DemoRole) {
    console.log('params:', role.name);
    // await getDataBaseClient().update('update SYS_ROLE set NAME=? where ROLE_ID = ? ', [role.name, role.code]);
    await getDataBaseClient().updateRow('SYS_ROLE', {NAME:role.name}, {ROLE_ID: role.code});
    return this.success(true);
  }
}
