"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsManager = void 0;
class SettingsManager {
    constructor(connection) {
        this.connection = connection;
        this.cache = new Map();
        this.changeListeners = new Map();
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
    get(key, defaultValue) {
        // Check cache first
        if (this.cache.has(key)) {
            return this.cache.get(key);
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
    onValueChange(key, callback) {
        if (!this.changeListeners.has(key)) {
            this.changeListeners.set(key, new Set());
        }
        this.changeListeners.get(key).add(callback);
    }
    generateId() {
        return `msg-setting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.SettingsManager = SettingsManager;
