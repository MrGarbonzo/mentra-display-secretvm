import { io, Socket } from 'socket.io-client';
import { Message } from '../types';

export class SimulatorConnection {
  private socket: Socket | null = null;
  private messageHandlers = new Map<string, Set<(msg: Message) => void>>();
  private pendingRequests = new Map<string, { resolve: (value: any) => void; reject: (reason: any) => void }>();

  async connect(url: string, code: string, appInfo: { packageName: string; name: string; version: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create Socket.IO client connection
      this.socket = io(url, {
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
          const message: Message = typeof data === 'string' ? JSON.parse(data) : data;
          console.log('SDK received message:', message.type, 'id:', message.id);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      // Handle disconnect
      this.socket.on('disconnect', (reason) => {
        console.log('Socket.IO connection closed:', reason);
      });
    });
  }

  sendMessage(message: Message): void {
    if (this.socket?.connected) {
      this.socket.emit('message', message);
    } else {
      console.error('Socket.IO not connected');
    }
  }

  async sendRequest<T>(type: string, payload: any, timeoutMs: number = 120000): Promise<T> {
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

  onMessage(type: string, handler: (msg: Message) => void): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    this.messageHandlers.get(type)!.add(handler);
  }

  offMessage(type: string, handler: (msg: Message) => void): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private handleMessage(message: Message): void {
    // Handle responses to pending requests
    if (message.type.includes('Result') || message.type.includes('Response')) {
      const pending = this.pendingRequests.get(message.id);
      if (pending) {
        pending.resolve(message.payload);
        this.pendingRequests.delete(message.id);
        return;
      }
    }

    // Handle regular messages
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message));
    }
  }

  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
