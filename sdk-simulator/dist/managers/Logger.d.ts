import { SimulatorConnection } from '../connection/SimulatorConnection';
export declare class Logger {
    private connection;
    constructor(connection: SimulatorConnection);
    info(message: string, context?: any): void;
    error(error: Error | string, message?: string, context?: any): void;
    debug(message: string, context?: any): void;
    warn(message: string, context?: any): void;
    private log;
    private generateId;
}
//# sourceMappingURL=Logger.d.ts.map