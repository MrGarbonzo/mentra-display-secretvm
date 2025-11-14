"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsManager = void 0;
class EventsManager {
    constructor(connection) {
        this.connection = connection;
    }
    onTranscription(callback) {
        this.connection.onMessage('event.transcription', (message) => {
            callback(message.payload);
        });
    }
    onGlassesBattery(callback) {
        this.connection.onMessage('event.battery', (message) => {
            callback(message.payload);
        });
    }
}
exports.EventsManager = EventsManager;
