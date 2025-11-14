import { SimulatorConnection } from '../connection/SimulatorConnection';

export class Logger {
  constructor(private connection: SimulatorConnection) {}

  info(message: string, context?: any): void {
    this.log('info', message, context);
  }

  error(error: Error | string, message?: string, context?: any): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const fullContext = {
      ...context,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    };
    this.log('error', message || errorMessage, fullContext);
  }

  debug(message: string, context?: any): void {
    this.log('debug', message, context);
  }

  warn(message: string, context?: any): void {
    this.log('warn', message, context);
  }

  private log(level: string, message: string, context?: any): void {
    // Also log locally
    console.log(`[${level.toUpperCase()}]`, message, context || '');

    // Send to simulator
    this.connection.sendMessage({
      id: this.generateId(),
      type: 'log',
      timestamp: Date.now(),
      payload: { level, message, context }
    });
  }

  private generateId(): string {
    return `msg-log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
