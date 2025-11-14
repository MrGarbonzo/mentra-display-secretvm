import { SimulatorConnection } from '../connection/SimulatorConnection';
export declare class DashboardContent {
    private connection;
    constructor(connection: SimulatorConnection);
    writeToMain(text: string): void;
    writeToExpanded(text: string): void;
    write(content: {
        main?: string;
        expanded?: string;
    }): void;
    private generateId;
}
export declare class DashboardManager {
    private connection;
    content: DashboardContent;
    constructor(connection: SimulatorConnection);
}
//# sourceMappingURL=DashboardManager.d.ts.map