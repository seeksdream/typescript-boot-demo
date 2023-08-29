import {appConfigOmmon} from './app-config-ommon';
// 请勿直接使用，使用请通过AppConfig
// 服务器环境以下配置中的变量值尽量从环境变量中取
export const appConfigForSIT:typeof appConfigOmmon = Object.assign({}, appConfigOmmon, {
  REDIS_CONFIG: {
    port: 6379, // Redis port
    host: 'xxxxxxxxxx', // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: 'xxxxxxxx',
    db: 4
  }
});
