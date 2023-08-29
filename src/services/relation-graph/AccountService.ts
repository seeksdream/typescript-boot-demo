import {
  BaseService,
  NoRequiredPermission,
  CodeError,
  throwWarningErrorIf, LogObject, getServiceLogger
} from "typescript-boot";
import {getSessionManager} from "typescript-boot";
import {getReqRemoteIp} from "typescript-boot";
import {UserDao} from './dao/UserDao';
import {
  apiDoc,
  apiParamFromBody,
  apiRequest,
  apiSessionUser, apiPath, apiPermission,
  apiReturn
} from "typescript-boot";
import {CustomSessionUser} from './AccountObjects';
import {generateUUID} from "typescript-boot";
@apiDoc('权限认证')
@apiPermission(NoRequiredPermission)
@apiPath('/account')
export default class AccountService extends BaseService{
  userDao = new UserDao();
  // 登陆
  @apiDoc('登录')
  @apiReturn('会话token(string)')
  async login(
    @apiParamFromBody('登录账号') account:string,
    @apiParamFromBody('登录密码(MD5)') password:string,
    @apiRequest() req
  ) {
    const requestStartTime = Date.now();
    console.log('[User Login]', req.body);
    if (account.substring(0, 4) === '=Hex') {
      account = Buffer.from(account.substring(4), 'base64').toString();
    }
    console.log('[User Login]' + account);
    const sessionUser = await this.userDao.getUserForLogin(account, password);
    const cmLogined = sessionUser.roles && sessionUser.roles.length === 1 && (sessionUser.roles[0] === 'cm' || sessionUser.roles[0] === 'cm-team-leader');
    throwWarningErrorIf(cmLogined, 'PC端没有可供客户经理角色使用的功能，您无需登录。');
    const token = generateUUID();
    await getSessionManager().regSession(token, sessionUser);
    const loginLogObject:LogObject = {
      success: true,
      dept_id: sessionUser ? sessionUser.deptId : '',
      user_id: sessionUser.userId,
      user_name: sessionUser.name,
      account: sessionUser.account,
      ip_addr: getReqRemoteIp(req),
      behavior_desc: '用户登录',
      used_time: Date.now() - requestStartTime
    };
    await getServiceLogger().insertLog(loginLogObject);
    return this.success(token);
  }
  // 客户端根据token获取当前用户信息
  @apiDoc('使用token换取用户信息')
  @apiReturn(CustomSessionUser)
  @apiPermission({login: true})
  async info(@apiSessionUser() sessionUser:CustomSessionUser) {
    if (!sessionUser) {
      throw new CodeError(403, 'Login failed, unable to get user details.');
    }
    sessionUser.password = '';
    return this.success(sessionUser);
  }
  // 注销
  @apiDoc('注销会话')
  @apiReturn('是否成功(Boolean)')
  async logout(req, res, loginUserInfo) {
    const token = getSessionManager().getToken(req);
    await getSessionManager().resetToKen(token);
    return this.success(true);
  }
  // 注销token
  @apiReturn('是否成功(Boolean)')
  async resetToken(req, res, loginUserInfo) {
    const { token } = req.body;
    await getSessionManager().resetToKen(token);
    return this.success(true);
  }
}
