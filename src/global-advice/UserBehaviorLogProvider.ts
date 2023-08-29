import {generateUUID, getDataBaseClient, LogObject, ServiceLogManager} from "typescript-boot";


export class DefaultUserBehaviorLogger implements ServiceLogManager{
  async insertLog(logObj:LogObject){
    try {
      const logId = generateUUID();
      console.log('insert log:', logId);
      const insertObject = {
        ID:logId,
        REQUEST_URI:logObj.request_path,
        REQUEST_PARAMS: logObj.request_params && JSON.stringify(logObj.request_params),
        DEPT_ID:logObj.dept_id,
        CLIENT_IP:logObj.ip_addr,
        USER_ID:logObj.user_id,
        USER_ACCOUNT:logObj.account,
        USER_NAME:logObj.user_name,
        TITLE:logObj.behavior_desc
      };
      await getDataBaseClient().insertRow('SYS_OPERATION_LOG', insertObject);
    } catch (e) {
      console.log('insert log error:', e.message);
    }
  }
}
