import { SimulatorConnection } from '../connection/SimulatorConnection';
export declare class SettingsManager {
    private connection;
    private cache;
    private changeListeners;
    constructor(connection: SimulatorConnection);
    get<T>(key: string, defaultValue: T): T;
    onValueChange<T>(key: string, callback: (newValue: T, oldValue: T) => void): void;
    private generateId;
}
//# sourceMappingURL=SettingsManager.d.ts.map