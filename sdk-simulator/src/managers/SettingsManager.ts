import { SimulatorConnection } from '../connection/SimulatorConnection';

export class SettingsManager {
  private cache = new Map<string, any>();
  private changeListeners = new Map<string, Set<(newValue: any, oldValue: any) => void>>();

  constructor(private connection: SimulatorConnection) {
    // Listen for setting value responses
    this.connection.onMessage('settings.value', (message) => {
      const { key, value } = message.payload;
      this.cache.set(key, value);
    });

    // Listen for setting changes from simulator
    this.connection.onMessage('settings.changed', (message) => {
      const { key, value } = message.payload;
      const oldValue = this.cache.get(key);
      this.cache.set(key, value);

      // Notify listeners
      const listeners = this.changeListeners.get(key);
      if (listeners) {
        listeners.forEach(fn => fn(value, oldValue));
      }
    });
  }

  get<T>(key: string, defaultValue: T): T {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key) as T;
    }

    // Request from simulator (async, but return default immediately)
    this.connection.sendMessage({
      id: this.generateId(),
      type: 'settings.get',
      timestamp: Date.now(),
      payload: { key, defaultValue }
    });

    // Cache and return default value
    this.cache.set(key, defaultValue);
    return defaultValue;
  }

  onValueChange<T>(key: string, callback: (newValue: T, oldValue: T) => void): void {
    if (!this.changeListeners.has(key)) {
      this.changeListeners.set(key, new Set());
    }
    this.changeListeners.get(key)!.add(callback);
  }

  private generateId(): string {
    return `msg-setting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
