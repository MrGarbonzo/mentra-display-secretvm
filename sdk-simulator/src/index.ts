/**
 * @mentra/sdk-simulator
 * Mock MentraOS SDK for testing apps without physical glasses
 */

// Main classes
export { AppServer } from './AppServer';
export { AppSession } from './AppSession';

// Managers
export { CameraManager } from './managers/CameraManager';
export { LayoutManager, ViewType } from './managers/LayoutManager';
export { DashboardManager } from './managers/DashboardManager';
export { EventsManager, TranscriptionData, BatteryData } from './managers/EventsManager';
export { SettingsManager } from './managers/SettingsManager';
export { Logger } from './managers/Logger';

// Types
export {
  ViewType as ViewTypeEnum,
  LayoutOptions,
  PhotoResult,
  TranscriptionData as TranscriptionDataType,
  BatteryData as BatteryDataType,
  AppServerConfig,
  ToolCall
} from './types';

// Re-export ViewType for convenience
export { ViewType as StreamType } from './types';
