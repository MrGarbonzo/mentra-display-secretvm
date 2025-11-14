import { SimulatorConnection } from './connection/SimulatorConnection';
import { CameraManager } from './managers/CameraManager';
import { LayoutManager } from './managers/LayoutManager';
import { DashboardManager } from './managers/DashboardManager';
import { EventsManager } from './managers/EventsManager';
import { SettingsManager } from './managers/SettingsManager';
import { Logger } from './managers/Logger';
import { TranscriptionData } from './types';
export declare class AppSession {
    private connection;
    sessionId: string;
    userId: string;
    camera: CameraManager;
    layouts: LayoutManager;
    dashboard: DashboardManager;
    events: EventsManager;
    settings: SettingsManager;
    logger: Logger;
    private languageHandlers;
    constructor(connection: SimulatorConnection, sessionId: string, userId: string);
    /**
     * Subscribe to language-specific transcription events
     * Returns a cleanup function to unsubscribe
     */
    onTranscriptionForLanguage(locale: string, callback: (data: TranscriptionData) => void): () => void;
    private setupLanguageTranscriptionRouting;
}
//# sourceMappingURL=AppSession.d.ts.map