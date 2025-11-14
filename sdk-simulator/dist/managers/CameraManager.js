"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraManager = void 0;
class CameraManager {
    constructor(connection) {
        this.connection = connection;
    }
    async requestPhoto(options = {}) {
        try {
            const response = await this.connection.sendRequest('camera.requestPhoto', options, 60000); // 60 second timeout for photo capture
            // Convert base64 to Buffer
            const bufferData = Buffer.from(response.buffer, 'base64');
            return {
                buffer: bufferData,
                mimeType: response.mimeType,
                size: response.size
            };
        }
        catch (error) {
            throw new Error(`Camera request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // Streaming methods (not implemented in simulator yet)
    async startManagedStream(options) {
        throw new Error('RTMP streaming not supported in simulator yet');
    }
    async startUnmanagedStream(options) {
        throw new Error('RTMP streaming not supported in simulator yet');
    }
}
exports.CameraManager = CameraManager;
