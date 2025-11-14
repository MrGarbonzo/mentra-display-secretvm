"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSession = void 0;
const CameraManager_1 = require("./managers/CameraManager");
const LayoutManager_1 = require("./managers/LayoutManager");
const DashboardManager_1 = require("./managers/DashboardManager");
const EventsManager_1 = require("./managers/EventsManager");
const SettingsManager_1 = require("./managers/SettingsManager");
const Logger_1 = require("./managers/Logger");
class AppSession {
    constructor(connection, sessionId, userId) {
        this.connection = connection;
        this.sessionId = sessionId;
        this.userId = userId;
        this.languageHandlers = new Map();
        this.camera = new CameraManager_1.CameraManager(connection);
        this.layouts = new LayoutManager_1.LayoutManager(connection);
        this.dashboard = new DashboardManager_1.DashboardManager(connection);
        this.events = new EventsManager_1.EventsManager(connection);
        this.settings = new SettingsManager_1.SettingsManager(connection);
        this.logger = new Logger_1.Logger(connection);
        // Setup language-specific transcription routing
        this.setupLanguageTranscriptionRouting();
    }
    /**
     * Subscribe to language-specific transcription events
     * Returns a cleanup function to unsubscribe
     */
    onTranscriptionForLanguage(locale, callback) {
        if (!this.languageHandlers.has(locale)) {
            this.languageHandlers.set(locale, new Set());
        }
        this.languageHandlers.get(locale).add(callback);
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
    setupLanguageTranscriptionRouting() {
        this.events.onTranscription((data) => {
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
exports.AppSession = AppSession;
