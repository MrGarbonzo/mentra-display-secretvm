"use strict";
/**
 * @mentra/sdk-simulator
 * Mock MentraOS SDK for testing apps without physical glasses
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamType = exports.ViewTypeEnum = exports.Logger = exports.SettingsManager = exports.EventsManager = exports.DashboardManager = exports.ViewType = exports.LayoutManager = exports.CameraManager = exports.AppSession = exports.AppServer = void 0;
// Main classes
var AppServer_1 = require("./AppServer");
Object.defineProperty(exports, "AppServer", { enumerable: true, get: function () { return AppServer_1.AppServer; } });
var AppSession_1 = require("./AppSession");
Object.defineProperty(exports, "AppSession", { enumerable: true, get: function () { return AppSession_1.AppSession; } });
// Managers
var CameraManager_1 = require("./managers/CameraManager");
Object.defineProperty(exports, "CameraManager", { enumerable: true, get: function () { return CameraManager_1.CameraManager; } });
var LayoutManager_1 = require("./managers/LayoutManager");
Object.defineProperty(exports, "LayoutManager", { enumerable: true, get: function () { return LayoutManager_1.LayoutManager; } });
Object.defineProperty(exports, "ViewType", { enumerable: true, get: function () { return LayoutManager_1.ViewType; } });
var DashboardManager_1 = require("./managers/DashboardManager");
Object.defineProperty(exports, "DashboardManager", { enumerable: true, get: function () { return DashboardManager_1.DashboardManager; } });
var EventsManager_1 = require("./managers/EventsManager");
Object.defineProperty(exports, "EventsManager", { enumerable: true, get: function () { return EventsManager_1.EventsManager; } });
var SettingsManager_1 = require("./managers/SettingsManager");
Object.defineProperty(exports, "SettingsManager", { enumerable: true, get: function () { return SettingsManager_1.SettingsManager; } });
var Logger_1 = require("./managers/Logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return Logger_1.Logger; } });
// Types
var types_1 = require("./types");
Object.defineProperty(exports, "ViewTypeEnum", { enumerable: true, get: function () { return types_1.ViewType; } });
// Re-export ViewType for convenience
var types_2 = require("./types");
Object.defineProperty(exports, "StreamType", { enumerable: true, get: function () { return types_2.ViewType; } });
