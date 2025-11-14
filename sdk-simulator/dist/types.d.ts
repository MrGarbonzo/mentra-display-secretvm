/**
 * Type definitions for MentraOS SDK Simulator
 */
export interface Message {
    id: string;
    type: string;
    timestamp: number;
    payload: any;
}
export declare enum ViewType {
    MAIN = "main",
    DASHBOARD = "dashboard"
}
export interface LayoutOptions {
    view?: ViewType;
    durationMs?: number;
}
export interface PhotoResult {
    buffer: Buffer;
    mimeType: string;
    size: number;
}
export interface TranscriptionData {
    text: string;
    isFinal: boolean;
    transcribeLanguage?: string;
}
export interface BatteryData {
    level: number;
    charging: boolean;
}
export interface HardwareCapabilities {
    camera: boolean;
    display: boolean;
    imageDisplay: boolean;
    microphone: boolean;
    speaker: boolean;
}
export interface AppServerConfig {
    packageName: string;
    apiKey: string;
    port: number;
    publicDir?: string;
    simulator?: {
        enabled: boolean;
        url: string;
        code: string;
    };
}
export interface ToolCall {
    userId: string;
    toolName: string;
    parameters: Record<string, any>;
}
//# sourceMappingURL=types.d.ts.map