import { SimulatorConnection } from './connection/SimulatorConnection';
import { CameraManager } from './managers/CameraManager';
import { LayoutManager } from './managers/LayoutManager';
import { DashboardManager } from './managers/DashboardManager';
import { EventsManager } from './managers/EventsManager';
import { SettingsManager } from './managers/SettingsManager';
import { Logger } from './managers/Logger';
import { TranscriptionData } from './types';

export class AppSession {
  public camera: CameraManager;
  public layouts: LayoutManager;
  public dashboard: DashboardManager;
  public events: EventsManager;
  public settings: SettingsManager;
  public logger: Logger;

  private languageHandlers = new Map<string, Set<(data: TranscriptionData) => void>>();

  constructor(
    private connection: SimulatorConnection,
    public sessionId: string,
    public userId: string
  ) {
    this.camera = new CameraManager(connection);
    this.layouts = new LayoutManager(connection);
    this.dashboard = new DashboardManager(connection);
    this.events = new EventsManager(connection);
    this.settings = new SettingsManager(connection);
    this.logger = new Logger(connection);

    // Setup language-specific transcription routing
    this.setupLanguageTranscriptionRouting();
  }

  /**
   * Subscribe to language-specific transcription events
   * Returns a cleanup function to unsubscribe
   */
  onTranscriptionForLanguage(
    locale: string,
    callback: (data: TranscriptionData) => void
  ): () => void {
    if (!this.languageHandlers.has(locale)) {
      this.languageHandlers.set(locale, new Set());
    }

    this.languageHandlers.get(locale)!.add(callback);

    // Return cleanup function
    return () => {
      const handlers = this.languageHandlers.get(locale);
      if (handlers) {
        handlers.delete(callback);
        if (handlers.size === 0) {
          this.languageHandlers.delete(locale);
        }
      }
    };
  }

  private setupLanguageTranscriptionRouting(): void {
    this.events.onTranscription((data: TranscriptionData) => {
      const locale = data.transcribeLanguage || 'en-US';

      // Call language-specific handlers
      const handlers = this.languageHandlers.get(locale);
      if (handlers) {
        handlers.forEach(handler => handler(data));
      }

      // Also call wildcard handlers (if any registered for '*')
      const wildcardHandlers = this.languageHandlers.get('*');
      if (wildcardHandlers) {
        wildcardHandlers.forEach(handler => handler(data));
      }
    });
  }
}
