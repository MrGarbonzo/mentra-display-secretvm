"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatorConnection = void 0;
const socket_io_client_1 = require("socket.io-client");
class SimulatorConnection {
    constructor() {
        this.socket = null;
        this.messageHandlers = new Map();
        this.pendingRequests = new Map();
    }
    async connect(url, code, appInfo) {
        return new Promise((resolve, reject) => {
            // Create Socket.IO client connection
            this.socket = (0, socket_io_client_1.io)(url, {
                transports: ['websocket'],
                reconnection: false
            });
            const timeout = setTimeout(() => {
                reject(new Error('Connection timeout'));
                this.socket?.disconnect();
            }, 10000);
            // Handle successful connection to server
            this.socket.on('connect', () => {
                // Send SDK connection request with pairing code
                this.socket?.emit('sdk:connect', {
                    payload: { code, appInfo }
                });
            });
            // Handle successful SDK pairing
            this.socket.on('connected', (data) => {
                clearTimeout(timeout);
                console.log('SDK connected to simulator:', data);
                resolve();
            });
            // Handle errors from server
            this.socket.on('error', (error) => {
                clearTimeout(timeout);
                reject(new Error(error.message || 'Connection error'));
            });
            // Handle connection errors
            this.socket.on('connect_error', (error) => {
                clearTimeout(timeout);
                reject(new Error(`Connection failed: ${error.message}`));
            });
            // Handle messages from simulator
            this.socket.on('message', (data) => {
                try {
                    const message = typeof data === 'string' ? JSON.parse(data) : data;
                    console.log('SDK received message:', message.type, 'id:', message.id);
                    this.handleMessage(message);
                }
                catch (error) {
                    console.error('Error parsing message:', error);
                }
            });
            // Handle disconnect
            this.socket.on('disconnect', (reason) => {
                console.log('Socket.IO connection closed:', reason);
            });
        });
    }
    sendMessage(message) {
        if (this.socket?.connected) {
            this.socket.emit('message', message);
        }
        else {
            console.error('Socket.IO not connected');
        }
    }
    async sendRequest(type, payload, timeoutMs = 120000) {
        return new Promise((resolve, reject) => {
            const requestId = this.generateId();
            // Store pending request
            this.pendingRequests.set(requestId, { resolve, reject });
            // Send message
            this.sendMessage({
                id: requestId,
                type,
                timestamp: Date.now(),
                payload
            });
            // Timeout
            setTimeout(() => {
                if (this.pendingRequests.has(requestId)) {
                    this.pendingRequests.delete(requestId);
                    reject(new Error(`Request timeout: ${type}`));
                }
            }, timeoutMs);
        });
    }
    onMessage(type, handler) {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, new Set());
        }
        this.messageHandlers.get(type).add(handler);
    }
    offMessage(type, handler) {
        const handlers = this.messageHandlers.get(type);
        if (handlers) {
            handlers.delete(handler);
        }
    }
    handleMessage(message) {
        console.log('handleMessage called:', message.type, 'id:', message.id);
        // Handle responses to pending requests
        if (message.type.includes('Result') || message.type.includes('Response')) {
            console.log('Response message detected, looking for pending request');
            console.log('Pending requests:', Array.from(this.pendingRequests.keys()));
            const pending = this.pendingRequests.get(message.id);
            if (pending) {
                console.log('Match found! Resolving pending request');
                pending.resolve(message.payload);
                this.pendingRequests.delete(message.id);
                return;
            }
            else {
                console.log('No matching pending request found for id:', message.id);
            }
        }
        // Handle regular messages
        const handlers = this.messageHandlers.get(message.type);
        if (handlers) {
            handlers.forEach(handler => handler(message));
        }
    }
    generateId() {
        return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}
exports.SimulatorConnection = SimulatorConnection;
