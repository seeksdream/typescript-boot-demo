#!/usr/bin/env node
import 'reflect-metadata';
import {
  MysqlClient,
  SeeksWebServer, SessionManagerByFS,
  setupDataBaseClient,
  setupServiceLogManager,
  setupSessionManager
} from 'typescript-boot';
import {AppConfig} from './AppConfig';
import DemoService from "./services/seeks-boot-demo/DemoService";
import AccountService from "./services/relation-graph/AccountService";
import {DefaultUserBehaviorLogger} from "./global-advice/UserBehaviorLogProvider";
setupServiceLogManager(new DefaultUserBehaviorLogger());
setupDataBaseClient(new MysqlClient(AppConfig.MYSQL_CONFIG));
setupSessionManager(new SessionManagerByFS(AppConfig.SESSION_EXPIRED_TIME, AppConfig.CORE_DATA_FOLDER));
const server = new SeeksWebServer(AppConfig.servicePort);
// 设置静态文件根目录，比如前端打包而成的dist目录，dist目录一般是一个包含index.html的目录。
server.setFontRootPath(AppConfig.UI_dist);
// 以下是示例service
server.publishService(new AccountService());
server.publishService(new DemoService());
server.start();
