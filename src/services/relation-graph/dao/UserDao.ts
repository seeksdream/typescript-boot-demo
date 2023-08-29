import {CustomSessionUser} from "../AccountObjects";
import {getDataBaseClient, throwWarningErrorIf} from "typescript-boot";

export class UserDao {
  async getUserForLogin(userAccount:string, password:string):Promise<CustomSessionUser> {
    console.log('Login user:', userAccount);
    const userInfo = await this.getUserByAccount(userAccount, true);
    console.log(userInfo);
    throwWarningErrorIf(!userInfo, '用户不存在');
    throwWarningErrorIf(!password, '密码不能为空！');
    throwWarningErrorIf(!userInfo.password, '用户[' + userAccount + ']未初始化密码！');
    throwWarningErrorIf(password.toUpperCase() !== password.toUpperCase(), '密码错误');
    const roles = await getDataBaseClient().getList<any>(
      null,
      'select ROLE_ID from SYS_USER_ROLE where USER_ID=? ',
      [userInfo.userId]
    );
    userInfo.roles = roles.map(role => role.ROLE_ID as string);
    return userInfo;
  }
  async getUserByAccount(account:string, isReturnOrignObject:boolean):Promise<CustomSessionUser> {
    const _user_list = await getDataBaseClient().getList<CustomSessionUser>(
      CustomSessionUser,
      `select 
            u.*, dept.PARENT_ID, dept.DEPT_NAME as DEPT_NAME 
            from SYS_USER u 
            left join SYS_DEPT dept on u.dept_id=dept.dept_id
            where u.account=?
            `,
      [account]
    );
    _user_list.map(role => role.userId);
    if (_user_list.length > 0) {
      const user_info = _user_list[0];
      if (!isReturnOrignObject) user_info.password = '';
      return user_info;
    }
    return null;
  }
}
