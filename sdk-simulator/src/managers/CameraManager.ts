import { SimulatorConnection } from '../connection/SimulatorConnection';
import { PhotoResult } from '../types';

export class CameraManager {
  constructor(private connection: SimulatorConnection) {}

  async requestPhoto(options: { saveToGallery?: boolean } = {}): Promise<PhotoResult> {
    try {
      const response = await this.connection.sendRequest<{
        buffer: string; // base64 encoded
        mimeType: string;
        size: number;
      }>('camera.requestPhoto', options, 60000); // 60 second timeout for photo capture

      // Convert base64 to Buffer
      const bufferData = Buffer.from(response.buffer, 'base64');

      return {
        buffer: bufferData,
        mimeType: response.mimeType,
        size: response.size
      };
    } catch (error) {
      throw new Error(`Camera request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Streaming methods (not implemented in simulator yet)
  async startManagedStream(options?: any): Promise<any> {
    throw new Error('RTMP streaming not supported in simulator yet');
  }

  async startUnmanagedStream(options?: any): Promise<any> {
    throw new Error('RTMP streaming not supported in simulator yet');
  }
}
