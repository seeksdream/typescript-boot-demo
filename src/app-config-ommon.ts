// 请勿直接使用，使用请通过AppConfig
export const appConfigOmmon = {
  env_name: 'DEV',
  servicePort: 13333,
  SESSION_EXPIRED_TIME: 1000 * 60 * 60 * 24,
  CORE_DATA_FOLDER : '/data/xxxxxxxxxx',
  CORE_DATA_FOLDER_UPLOAD_FILE: '/data/xxxxxxxxxx/upload',
  MYSQL_CONFIG: {
    host: 'xxxxxxxxxxxxx',
    port: 13306,
    user: 'tc_bee',
    password: 'tc_bee@teamcom',
    database: 'tc_bee',
    // dateStrings: true, //强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回，而不是一javascript Date对象返回. (默认: false)
    timezone: '+08:00'
  },
  // DM8_CONFIG: {
  //   poolMin: 3,
  //   poolMax: 100,
  //   autoCommit: true,
  //   password: 'df0bcb7c6fe61ebc4385a1b70919fa2d', // SYSDBA001
  //   connectString: 'dm://SYSDBA:${password}@localhost:5236?schema=CYL'
  // },
  REDIS_CONFIG: {
    port: 6379, // Redis port
    host: 'localhost', // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: '',
    db: 4
  },
  UI_dist: '../ui-dist'
};
