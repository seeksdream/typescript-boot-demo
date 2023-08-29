import {BaseService, NoRequiredPermission, CodeError, WarningError, getServiceLogger, LogObject} from 'typescript-boot';
import {getSessionManager} from 'typescript-boot';
import {
  CustomLogObject,
  getReqRemoteIp,
} from 'typescript-boot';
import {
  apiDoc, apiDocArrayItem, apiDocEnum, apiLogToDB,
  apiParamFromBody, apiParamFromHeader, apiParamFromQuery,
  apiRequest, apiResponse,
  apiSessionUser, apiPath, apiPermission,
  apiReturn, apiBodyAsParam
} from 'typescript-boot';
import {RESPONSE_TYPE} from 'typescript-boot';
import {
  DemoLoginUser,
  DeptInfo,
  PageQueryRequest4UserTable,
  PageQueryResult4UserTable, UserInfo,
} from './DemoVo';
import {DemoDao} from './dao/DemoDao';
import {generateUUID} from 'typescript-boot';

@apiDoc('API-service示例')
@apiPath('/demo-api')
@apiPermission({
  login: true,
  roles: ['admin', 'branch-admin', 'cm', 'risk-manager']
})
export default class DemoService extends BaseService{
  demoDao = new DemoDao();
  @apiDoc('登录')
  @apiReturn('会话token(string)')
  async login(
    @apiParamFromHeader('从header中获取：源系统识别码') accessKey:string,
    @apiParamFromQuery('从url中获取：统一认证标识') ticket:string,
    @apiParamFromBody('从body中获取单个参数') id,
    @apiParamFromBody('从body中获取单个参数') age:number,
    @apiParamFromBody('从body中获取单个参数并设置类型') nickname:string,
    @apiParamFromBody('从body中获取一个对象,将body.dept转换为DeptInfo对象') dept:DeptInfo,
    @apiBodyAsParam('从body中同时解构出多个参数') {account1, password}, // 从body中同时解构出多个参数
    @apiBodyAsParam('从body中获取一个对象并解构到属性（从body中获取解构需要的属性，这些属性会拥有在对象中定义的类型和注释信息）') {username, gender}:UserInfo,
    @apiBodyAsParam('从body中获取一个对象（从body中获取与对象属性匹配的所有值，然后拼装为对象）') user:UserInfo,
    @apiRequest() req, // 获取http:Request
    @apiResponse() res, // 获取http:Response
  ) {
    const requestStartTime = Date.now();
    // const {password, userAgent} = req.body;
    // let username = req.body.username;
    console.log('[User Login]', req.body);
    if (username.substring(0, 4) === '=Hex') {
      username = Buffer.from(username.substring(4), 'base64').toString();
    }
    console.log('[User Login]' + username);
    const sessionUser = await this.demoDao.getUserForLogin(username, password);
    const token = generateUUID();
    if (sessionUser.roles && sessionUser.roles.length === 1 && (sessionUser.roles[0] === 'cm' || sessionUser.roles[0] === 'cm-team-leader')) {
      throw new WarningError('PC端没有可供客户经理角色使用的功能，您无需登录。');
    }
    await getSessionManager().regSession(token, sessionUser);
    const loginLogObject:LogObject = {
      user_id: sessionUser.userId,
      user_name: sessionUser.name,
      account: username,
      ip_addr: getReqRemoteIp(req),
      dept_id: sessionUser ? sessionUser.deptId : '',
      success: true,
      behavior_desc: '用户登录',
      used_time: Date.now() - requestStartTime
    };
    await getServiceLogger().insertLog(loginLogObject);
    return this.success(token);
  }
  // 客户端根据token获取当前用户信息
  @apiDoc('使用token换取用户信息')
  @apiReturn(DemoLoginUser)
  async info(@apiSessionUser() sessionUser) {
    if (!sessionUser) {
      // 让前端可以接收到一个指定错误码的异常
      throw new CodeError(403, 'Login failed, unable to get user details.');
    }
    return this.success(sessionUser);
  }
  // 注销
  @apiDoc('注销会话')
  @apiReturn('是否成功(Boolean)')
  async logout(@apiParamFromHeader('当前token') token) {
    await getSessionManager().resetToKen(token);
    return this.success(true);
  }
  // 注销
  @apiDoc('通用方法')
  @apiReturn(Array)
  @apiDocArrayItem({oppNo:'商机编号', oppName:'商机名称'})
  async getList(req, res, sessionUser) {
    const token = getSessionManager().getToken(req);
    await getSessionManager().resetToKen(token);
    const list = [
      { id:'1', title:'商机1', status: '0', create_time: '2021-12-22 13:03:01' },
      { id:'2', title:'商机2', status: '0', create_time: '2021-12-22 14:03:01' },
      { id:'3', title:'商机3', status: '1', create_time: '2021-12-22 15:03:01' },
      { id:'4', title:'商机4', status: '0', create_time: '2021-12-22 16:03:01' },
    ];
    return this.success(list);
  }
  @apiDoc('获取IP(已字符串形式返回结果而不是json)')
  @apiReturn('客户端IP地址', RESPONSE_TYPE.TEXT)
  @apiPermission(NoRequiredPermission)
  async ip(@apiRequest() req) {
    const ipAddr = getReqRemoteIp(req);
    return ipAddr;
  }
  @apiDoc('根据文字生成图片')
  @apiReturn('download:客户端IP地址', RESPONSE_TYPE.BINARY)
  async downloadImage(
    @apiRequest() req,
    @apiParamFromQuery('图片上要显示的文字') text:string,
    @apiResponse() res
  ) {
    console.log('generate image:', text);
    // // 创建图像宽度和高度（根据需要修改）
    // const imageWidth = 500;
    // const imageHeight = 200;
    //
    // // 设置字体样式
    // const fontSize=30;
    //
    // let textX=Math.floor(imageWidth/2);
    // let textY=Math.floor(imageHeight/2);
    //
    // // 计算文本居中位置
    // if(text.length>0){
    //   // 创建画布对象
    //   const canvas = createCanvas(imageWidth, imageHeight);
    //   const ctx = canvas.getContext('2d');
    //
    //   // 假设 Arial 字体文件位于当前目录下的 fonts 文件夹内。
    //   // registerFont('./fonts/Arial.ttf', { family: 'Arial' });
    //
    //   ctx.fillStyle='#ffffff';
    //   ctx.fillRect(0,0,imageWidth,imageHeight);
    //
    //   ctx.font=`Bold ${fontSize}px Arial`;
    //   ctx.textAlign='center';
    //   ctx.textBaseline='middle';
    //
    //   textX-=ctx.measureText(text).width/2;
    //
    //   for(let i=0;i<text.length;i++){
    //     let char=text.charAt(i);
    //     let color=(i%3)*85;
    //
    //     // 绘制文本字符
    //     ctx.fillStyle=`rgb(${color},${color},${color})`;
    //     ctx.fillText(char,textX+i*fontSize,textY);
    //   }
    // }
    // try {
    //   res.set("Content-Disposition","attachment;filename=image.png");
    //   res.set("Content-Type","image/png");
    //   canvas.createPNGStream().pipe(res);
    // } catch(err){
    //   console.log('generate image error:', err);
    //   throw Error('创建图片时出错：' + err.message);
    // }
    return this.streamed();
  }
  // 注销token
  @apiDoc('获取数据库表')
  @apiReturn(PageQueryResult4UserTable)
  @apiLogToDB()
  async getUserTables(@apiBodyAsParam() pageQuery:PageQueryRequest4UserTable) {
    console.log('pageQuery:', pageQuery);
    return this.success({
      list: [],
      total: 1234
    });
  }
  // 注销token
  @apiDoc('简易的自定义结果')
  @apiReturn({
    name: '用户昵称',
    bio: '用户自我介绍',
    gender: '性别：male|female|unknown'
  })
  @apiLogToDB(async(pageQuery:PageQueryRequest4UserTable) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // 不要怀疑，这里的this上下文就是当前service的实例
    await this.demoDao.getUserById('');
    const customLogObject:CustomLogObject = { // 自定义日志要保存的内容（这里自定义了request_params来保存请求参数;自定义了日志行为描述behavior_desc）
      behavior_desc: `查询了第${pageQuery.currentPage}页的数据`,
      request_params: {
        ...pageQuery
      }
    };
    return customLogObject; // 这里还可以不返回任何内容，这样就不会保存相关日志了（当然如果想完全不保存的话，可以不加apiLogToDB装饰器就可以了）
  })
  async getUserProfile(@apiBodyAsParam() pageQuery:PageQueryRequest4UserTable) {
    console.log('pageQuery:', pageQuery);
    return this.success({
      name: '张三',
      bio: '世界很大，但我没时间去看看，不仅是因为没钱',
      gender: 'male'
    });
  }
  @apiDoc('一级路径')
  @apiReturn('是否成功（boolean）')
  @apiPath('')
  default(
    @apiParamFromBody('要更改的用户的id') userId:string,
    @apiParamFromBody('为用户赋予的角色id集合') roleIds:string[]
  ) {
    console.log('default', userId, roleIds);
    return this.success(true);
  }
}
