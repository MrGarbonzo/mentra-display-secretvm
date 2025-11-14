"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppServer = void 0;
const AppSession_1 = require("./AppSession");
const SimulatorConnection_1 = require("./connection/SimulatorConnection");
class AppServer {
    constructor(config) {
        this.cleanupHandlers = [];
        this.config = config;
        // Validate required config
        if (!config.packageName) {
            throw new Error('packageName is required in AppServer config');
        }
        if (!config.apiKey) {
            throw new Error('apiKey is required in AppServer config');
        }
    }
    async start() {
        console.log(`🚀 Starting ${this.config.packageName}...`);
        if (this.config.simulator?.enabled) {
            await this.connectToSimulator();
        }
        else {
            console.log('⚠️  Running with real MentraOS (not implemented in this mock SDK)');
            throw new Error('Real MentraOS connection not supported - use simulator mode');
        }
    }
    async connectToSimulator() {
        const { url, code } = this.config.simulator;
        console.log(`🔌 Connecting to simulator: ${url}`);
        console.log(`🔑 Pairing code: ${code}`);
        this.connection = new SimulatorConnection_1.SimulatorConnection();
        try {
            await this.connection.connect(url, code, {
                packageName: this.config.packageName,
                name: this.config.packageName.split('.').pop() || 'Unknown App',
                version: '1.0.0'
            });
            console.log('✅ Connected to simulator');
            // Create session
            const session = new AppSession_1.AppSession(this.connection, 'session-001', 'user-001');
            // Call user's onSession handler
            await this.onSession(session, 'session-001', 'user-001');
            console.log('✅ Session initialized');
        }
        catch (error) {
            console.error('❌ Failed to connect to simulator:', error);
            throw error;
        }
    }
    /**
     * Register a cleanup handler to be called when session ends
     */
    addCleanupHandler(handler) {
        this.cleanupHandlers.push(handler);
    }
    /**
     * Called when a session is stopped (optional)
     */
    async onStop(sessionId, userId, reason) {
        // Default implementation - can be overridden
        console.log(`Session ${sessionId} stopped: ${reason}`);
    }
    /**
     * Called when a tool is invoked (optional)
     */
    async onToolCall(toolCall) {
        // Default implementation - can be overridden
        console.log(`Tool call received: ${toolCall.toolName}`);
        return undefined;
    }
    /**
     * Cleanup and disconnect
     */
    async stop() {
        // Run all cleanup handlers
        this.cleanupHandlers.forEach(handler => {
            try {
                handler();
            }
            catch (error) {
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
exports.AppServer = AppServer;
