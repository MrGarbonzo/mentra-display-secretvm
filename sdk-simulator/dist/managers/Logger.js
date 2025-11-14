"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(connection) {
        this.connection = connection;
    }
    info(message, context) {
        this.log('info', message, context);
    }
    error(error, message, context) {
        const errorMessage = error instanceof Error ? error.message : error;
        const fullContext = {
            ...context,
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined
        };
        this.log('error', message || errorMessage, fullContext);
    }
    debug(message, context) {
        this.log('debug', message, context);
    }
    warn(message, context) {
        this.log('warn', message, context);
    }
    log(level, message, context) {
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
    generateId() {
        return `msg-log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.Logger = Logger;
