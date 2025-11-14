import { Message } from '../types';
export declare class SimulatorConnection {
    private socket;
    private messageHandlers;
    private pendingRequests;
    connect(url: string, code: string, appInfo: {
        packageName: string;
        name: string;
        version: string;
    }): Promise<void>;
    sendMessage(message: Message): void;
    sendRequest<T>(type: string, payload: any, timeoutMs?: number): Promise<T>;
    onMessage(type: string, handler: (msg: Message) => void): void;
    offMessage(type: string, handler: (msg: Message) => void): void;
    private handleMessage;
    private generateId;
    disconnect(): void;
}
//# sourceMappingURL=SimulatorConnection.d.ts.map