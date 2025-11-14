import { SimulatorConnection } from '../connection/SimulatorConnection';
import { PhotoResult } from '../types';
export declare class CameraManager {
    private connection;
    constructor(connection: SimulatorConnection);
    requestPhoto(options?: {
        saveToGallery?: boolean;
    }): Promise<PhotoResult>;
    startManagedStream(options?: any): Promise<any>;
    startUnmanagedStream(options?: any): Promise<any>;
}
//# sourceMappingURL=CameraManager.d.ts.map