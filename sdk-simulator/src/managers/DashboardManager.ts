import { SimulatorConnection } from '../connection/SimulatorConnection';

export class DashboardContent {
  constructor(private connection: SimulatorConnection) {}

  writeToMain(text: string): void {
    this.connection.sendMessage({
      id: this.generateId(),
      type: 'dashboard.writeToMain',
      timestamp: Date.now(),
      payload: { text }
    });
  }

  writeToExpanded(text: string): void {
    this.connection.sendMessage({
      id: this.generateId(),
      type: 'dashboard.writeToExpanded',
      timestamp: Date.now(),
      payload: { text }
    });
  }

  write(content: { main?: string; expanded?: string }): void {
    if (content.main) {
      this.writeToMain(content.main);
    }
    if (content.expanded) {
      this.writeToExpanded(content.expanded);
    }
  }

  private generateId(): string {
    return `msg-dash-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class DashboardManager {
  public content: DashboardContent;

  constructor(private connection: SimulatorConnection) {
    this.content = new DashboardContent(connection);
  }
}
