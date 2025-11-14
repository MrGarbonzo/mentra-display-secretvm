"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardManager = exports.DashboardContent = void 0;
class DashboardContent {
    constructor(connection) {
        this.connection = connection;
    }
    writeToMain(text) {
        this.connection.sendMessage({
            id: this.generateId(),
            type: 'dashboard.writeToMain',
            timestamp: Date.now(),
            payload: { text }
        });
    }
    writeToExpanded(text) {
        this.connection.sendMessage({
            id: this.generateId(),
            type: 'dashboard.writeToExpanded',
            timestamp: Date.now(),
            payload: { text }
        });
    }
    write(content) {
        if (content.main) {
            this.writeToMain(content.main);
        }
        if (content.expanded) {
            this.writeToExpanded(content.expanded);
        }
    }
    generateId() {
        return `msg-dash-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.DashboardContent = DashboardContent;
class DashboardManager {
    constructor(connection) {
        this.connection = connection;
        this.content = new DashboardContent(connection);
    }
}
exports.DashboardManager = DashboardManager;
