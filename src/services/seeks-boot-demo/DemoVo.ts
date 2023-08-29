import {apiDoc, apiDocArrayItem, apiDocEnum, dbColumnName} from 'typescript-boot';

export enum GENDER {
  male = '1',
  famale= '2',
  other='3'
}

@apiDoc('角色对象')
export class Role {
  @apiDoc('角色id')
  roleId:string;
  @apiDoc('角色名称')
  roleName:string;
}
@apiDoc('部门信息')
export class DeptInfo {
  @apiDoc('部门名称')
  deptName:string;
  @apiDoc('部门id')
  id:number;
  @apiDoc('上级部门')
  parentDept:DeptInfo;
}

@apiDoc('用户信息')
export class UserInfo {
  @apiDoc('用户名')
  username:string;
  @apiDoc('账号')
  account:string;
  @apiDoc('密码')
  password:string;
  @apiDoc('用户id')
  id:number;
  @apiDoc('年龄')
  age:number;
  @apiDoc('性别')
  @apiDocEnum(GENDER)
  gender: GENDER;
  @apiDoc('所属机构id')
  deptId:string;
  @apiDoc('所属机构对象')
  @apiDocArrayItem(DeptInfo)
  dept:DeptInfo;
  @apiDoc('拥有的角色')
  @apiDocArrayItem(Role)
  roles:Role[];
  @apiDoc('拥有的角色id集合')
  @apiDocArrayItem(String)
  roleIds:string[];
}
@apiDoc('登录用户')
export class DemoLoginUser {
  @apiDoc('id')
  user_id:string;
  @apiDoc('姓名')
  name:string;
  @apiDoc('用户昵称')
  nickName:string;
}

@apiDoc('数据库表信息')
export class UserTable{
  @apiDoc('表名称')
  @dbColumnName('table_name')
  tableName:string;
  @apiDoc('所属表空间')
  TABLESPACE_NAME:string;
  @apiDoc('状态')
  status:string;
}
@apiDoc('分页查询请求')
export class PageQueryRequest{
  @apiDoc('每页显示的条数')
  pageSize:number;
  @apiDoc('当前页')
  currentPage:number;
}
@apiDoc('数据库表列表分页查询请求')
export class PageQueryRequest4UserTable extends PageQueryRequest{
}

@apiDoc('分页查询结果')
export class PageQueryResult{
  @apiDoc('数据列表')
  list:any;
  @apiDoc('总数据条数')
  total:number;
}
export enum emType {
  error= 'error',
  success= 'success',
  unknown= 'unknown'
}
export enum emLevel {
  level1=1,
  level2=2,
  level3=3
}
@apiDoc('数据库表列表分页查询结果')
export class PageQueryResult4UserTable extends PageQueryResult{
  @apiDoc('表数组')
  @apiDocArrayItem(UserTable)
  list:UserTable[];
  @apiDoc('元素')
  item:UserTable;
  @apiDoc('枚举类型')
  @apiDocEnum(emType)
  emType:emType;
  @apiDoc('级别')
  @apiDocEnum(emLevel)
  emLevel:emLevel;
}
