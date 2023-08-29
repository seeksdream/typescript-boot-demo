import {getDataBaseClient} from 'typescript-boot';
import {throwWarningErrorIf} from 'typescript-boot';
import {CustomSessionUser} from "../../relation-graph/AccountObjects";

export class DemoDao {
  async getUserForLogin(userAccount:string, password:string):Promise<CustomSessionUser> {
    console.log('Login user:', userAccount);
    const userInfo = await this.getUserById(userAccount, true);
    throwWarningErrorIf(!userInfo, '用户不存在');
    throwWarningErrorIf(!userInfo['password'], '用户[' + userAccount + ']未初始化密码！');
    throwWarningErrorIf(userInfo['password'].toLowerCase() !== password.toLowerCase(), '密码错误');
    const roles = await getDataBaseClient().getList<any>(
      null,
      'select ROLE_ID from SYS_USER_ROLE where USER_ID=? ',
      [userInfo.userId]
    );
    userInfo.roles = roles.map(role => role.ROLE_ID as string);
    return userInfo;
  }
  async getUserById(account:string, isReturnOrignObject:boolean):Promise<CustomSessionUser> {
    const _user_list = await getDataBaseClient().getList<CustomSessionUser>(
      CustomSessionUser,
      `select 
            u.*, dept.PARENT_ID, dept.name as DEPT_NAME 
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
