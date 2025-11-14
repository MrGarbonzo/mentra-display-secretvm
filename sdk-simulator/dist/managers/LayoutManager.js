"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewType = exports.LayoutManager = void 0;
const types_1 = require("../types");
Object.defineProperty(exports, "ViewType", { enumerable: true, get: function () { return types_1.ViewType; } });
class LayoutManager {
    constructor(connection) {
        this.connection = connection;
    }
    showTextWall(text, options) {
        this.connection.sendMessage({
            id: this.generateId(),
            type: 'layout.showTextWall',
            timestamp: Date.now(),
            payload: { text, options }
        });
    }
    showDoubleTextWall(topText, bottomText, options) {
        this.connection.sendMessage({
            id: this.generateId(),
            type: 'layout.showDoubleTextWall',
            timestamp: Date.now(),
            payload: { topText, bottomText, options }
        });
    }
    showReferenceCard(title, text, options) {
        this.connection.sendMessage({
            id: this.generateId(),
            type: 'layout.showReferenceCard',
            timestamp: Date.now(),
            payload: { title, text, options }
        });
    }
    showDashboardCard(leftText, rightText, options) {
        this.connection.sendMessage({
            id: this.generateId(),
            type: 'layout.showDashboardCard',
            timestamp: Date.now(),
            payload: { leftText, rightText, options }
        });
    }
    generateId() {
        return `msg-layout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.LayoutManager = LayoutManager;
