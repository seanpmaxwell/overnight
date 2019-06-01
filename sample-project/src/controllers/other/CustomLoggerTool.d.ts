import { ICustomLogger } from '@overnightjs/logger';
declare class CustomLoggerTool implements ICustomLogger {
    private readonly thirdPartyLoggingApplication;
    constructor();
    sendLog(content: any): void;
}
export default CustomLoggerTool;
