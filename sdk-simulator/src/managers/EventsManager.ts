import { SimulatorConnection } from '../connection/SimulatorConnection';
import { TranscriptionData, BatteryData } from '../types';

export class EventsManager {
  constructor(private connection: SimulatorConnection) {}

  onTranscription(callback: (data: TranscriptionData) => void): void {
    this.connection.onMessage('event.transcription', (message) => {
      callback(message.payload);
    });
  }

  onGlassesBattery(callback: (data: BatteryData) => void): void {
    this.connection.onMessage('event.battery', (message) => {
      callback(message.payload);
    });
  }

  // Additional event types can be added here as they're discovered
  // onButton, onLocation, etc.
}

export { TranscriptionData, BatteryData };
