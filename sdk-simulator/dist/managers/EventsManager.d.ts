import { SimulatorConnection } from '../connection/SimulatorConnection';
import { TranscriptionData, BatteryData } from '../types';
export declare class EventsManager {
    private connection;
    constructor(connection: SimulatorConnection);
    onTranscription(callback: (data: TranscriptionData) => void): void;
    onGlassesBattery(callback: (data: BatteryData) => void): void;
}
export { TranscriptionData, BatteryData };
//# sourceMappingURL=EventsManager.d.ts.map