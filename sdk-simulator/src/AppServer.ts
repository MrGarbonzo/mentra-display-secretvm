import { AppSession } from './AppSession';
import { SimulatorConnection } from './connection/SimulatorConnection';
import { AppServerConfig, ToolCall } from './types';

export abstract class AppServer {
  protected config: AppServerConfig;
  private connection?: SimulatorConnection;
  private cleanupHandlers: Array<() => void> = [];

  constructor(config: AppServerConfig) {
    this.config = config;

    // Validate required config
    if (!config.packageName) {
      throw new Error('packageName is required in AppServer config');
    }
    if (!config.apiKey) {
      throw new Error('apiKey is required in AppServer config');
    }
  }

  async start(): Promise<void> {
    console.log(`🚀 Starting ${this.config.packageName}...`);

    if (this.config.simulator?.enabled) {
      await this.connectToSimulator();
    } else {
      console.log('⚠️  Running with real MentraOS (not implemented in this mock SDK)');
      throw new Error('Real MentraOS connection not supported - use simulator mode');
    }
  }

  private async connectToSimulator(): Promise<void> {
    const { url, code } = this.config.simulator!;

    console.log(`🔌 Connecting to simulator: ${url}`);
    console.log(`🔑 Pairing code: ${code}`);

    this.connection = new SimulatorConnection();

    try {
      await this.connection.connect(url, code, {
        packageName: this.config.packageName,
        name: this.config.packageName.split('.').pop() || 'Unknown App',
        version: '1.0.0'
      });

      console.log('✅ Connected to simulator');

      // Create session
      const session = new AppSession(
        this.connection,
        'session-001',
        'user-001'
      );

      // Call user's onSession handler
      await this.onSession(session, 'session-001', 'user-001');

      console.log('✅ Session initialized');

    } catch (error) {
      console.error('❌ Failed to connect to simulator:', error);
      throw error;
    }
  }

  /**
   * Register a cleanup handler to be called when session ends
   */
  protected addCleanupHandler(handler: () => void): void {
    this.cleanupHandlers.push(handler);
  }

  /**
   * Called when a new session is created
   * Subclasses must implement this method
   */
  protected abstract onSession(
    session: AppSession,
    sessionId: string,
    userId: string
  ): Promise<void>;

  /**
   * Called when a session is stopped (optional)
   */
  protected async onStop(sessionId: string, userId: string, reason: string): Promise<void> {
    // Default implementation - can be overridden
    console.log(`Session ${sessionId} stopped: ${reason}`);
  }

  /**
   * Called when a tool is invoked (optional)
   */
  protected async onToolCall(toolCall: ToolCall): Promise<string | undefined> {
    // Default implementation - can be overridden
    console.log(`Tool call received: ${toolCall.toolName}`);
    return undefined;
  }

  /**
   * Cleanup and disconnect
   */
  async stop(): Promise<void> {
    // Run all cleanup handlers
    this.cleanupHandlers.forEach(handler => {
      try {
        handler();
      } catch (error) {
        console.error('Error running cleanup handler:', error);
      }
    });

    // Disconnect from simulator
    if (this.connection) {
      this.connection.disconnect();
    }

    console.log('👋 App stopped');
  }
}
