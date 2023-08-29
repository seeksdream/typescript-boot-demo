import {apiDoc, apiDocArrayItem, dbColumnName} from "typescript-boot";
import {SessionUser} from "typescript-boot";
@apiDoc('session用户信息')
export class CustomSessionUser implements SessionUser{
  @apiDoc('用户ID')
  @dbColumnName('user_id')
  userId:string;
  @apiDoc('所属机构id')
  @dbColumnName('dept_id')
  deptId:string;
  @apiDoc('所属机构名称')
  @dbColumnName('dept_name')
  deptName?:string;
  @apiDoc('登录账号')
  account:string;
  @apiDoc('用户姓名')
  name:string;
  @apiDoc('用户拥有的角色编号数组')
  @apiDocArrayItem(String)
  roles?:string[];
  @apiDoc('微信用户昵称（微信账号）')
  nickName?:string;
  @apiDoc('微信用户头像（base64）')
  avatar?:string;
  @apiDoc('微信用户头像地址')
  avatarUrl?:string;
  @apiDoc('微信登录openId(微信账号)')
  openId?:string;
  @apiDoc('电话号码')
  phone_no?:string;
  @apiDoc('密码')
  password?:string;
  @apiDoc('删除标志')
  @dbColumnName('DEL_FLAG')
  delFlag?:string;


  ticket?:string;
  loginChannel?:string;
}
