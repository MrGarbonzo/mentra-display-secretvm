import { AppSession } from './AppSession';
import { AppServerConfig, ToolCall } from './types';
export declare abstract class AppServer {
    protected config: AppServerConfig;
    private connection?;
    private cleanupHandlers;
    constructor(config: AppServerConfig);
    start(): Promise<void>;
    private connectToSimulator;
    /**
     * Register a cleanup handler to be called when session ends
     */
    protected addCleanupHandler(handler: () => void): void;
    /**
     * Called when a new session is created
     * Subclasses must implement this method
     */
    protected abstract onSession(session: AppSession, sessionId: string, userId: string): Promise<void>;
    /**
     * Called when a session is stopped (optional)
     */
    protected onStop(sessionId: string, userId: string, reason: string): Promise<void>;
    /**
     * Called when a tool is invoked (optional)
     */
    protected onToolCall(toolCall: ToolCall): Promise<string | undefined>;
    /**
     * Cleanup and disconnect
     */
    stop(): Promise<void>;
}
//# sourceMappingURL=AppServer.d.ts.map