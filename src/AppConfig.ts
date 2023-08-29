import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as moment from 'moment';
import {disableDevLog} from 'typescript-boot/lib/index.js';
import {appConfigForPROD} from './app-config-PROD';
import {appConfigForSIT} from './app-config-SIT';
import {appConfigOmmon} from './app-config-ommon';
moment.locale('zh-cn');

// let env_name = 'DEV';
// let env_name = 'PROD';
let env_name = 'SIT';
const SystemName = 'src-ts-boot';

let baseDir = `/data/DATA_${SystemName}`;
console.log('os.type()：', os.type());
// 如果是Mac本地开发环境，强制设置为DEV
if (os.type() === 'Darwin') {
  baseDir = path.resolve(os.homedir(), `SEEKS_DATA/${SystemName}`);
  env_name = 'DEV';
}
// 如果是windows本地开发环境，强制设置为DEV
if (os.type() === 'Windows_NT') {
  baseDir = path.resolve(os.homedir(), `SEEKS_DATA_${SystemName}`);
  env_name = 'DEV';
}

const createCurrentAppConfig = () => {
  if (env_name === 'PROD') {
    disableDevLog(); // 生产环境：关闭次要的控制台日志；
    return appConfigForPROD;
  } else if (env_name === 'SIT') {
    return appConfigForSIT;
  }
  return appConfigOmmon;
};
export const AppConfig = createCurrentAppConfig();
AppConfig.env_name = env_name;
AppConfig.CORE_DATA_FOLDER = baseDir;
AppConfig.CORE_DATA_FOLDER_UPLOAD_FILE = path.join(baseDir, 'UPLOAD_FILE');
if (AppConfig.UI_dist && !AppConfig.UI_dist.startsWith('/')) {
  console.log('AppConfig.UI_dist:', AppConfig.UI_dist);
  AppConfig.UI_dist = path.resolve(__dirname, AppConfig.UI_dist);
}
console.log('AppConfig.UI_dist:', AppConfig.UI_dist);
if (!fs.existsSync(AppConfig.CORE_DATA_FOLDER)) fs.mkdirSync(AppConfig.CORE_DATA_FOLDER);
console.log('服务端口：', AppConfig.servicePort);
console.log('用户目录：', os.homedir());
console.log('数据目录[CORE_DATA_FOLDER]：', AppConfig.CORE_DATA_FOLDER);
export default AppConfig;
