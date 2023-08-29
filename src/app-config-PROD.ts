import {appConfigOmmon} from './app-config-ommon';
// 请勿直接使用，使用请通过AppConfig
// 服务器环境以下配置中的变量值尽量从环境变量中取
export const appConfigForPROD:typeof appConfigOmmon = Object.assign({}, appConfigOmmon, {
  servicePort: 18001,
  MYSQL_CONFIG: {
    host: 'xxxxxxxxxxxxx',
    port: 13306,
    user: 'tc_bee',
    password: 'tc_bee@teamcom',
    database: 'tc_bee',
    // dateStrings: true, //强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回，而不是一javascript Date对象返回. (默认: false)
    timezone: '+08:00'
  },
  REDIS_CONFIG: {
    port: 6379, // Redis port
    host: 'xxxxxxxxxx', // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: 'xxxxxxxx',
    db: 4
  }
});

