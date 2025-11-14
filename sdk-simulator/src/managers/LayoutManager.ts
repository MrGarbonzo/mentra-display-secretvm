import { SimulatorConnection } from '../connection/SimulatorConnection';
import { ViewType, LayoutOptions } from '../types';

export class LayoutManager {
  constructor(private connection: SimulatorConnection) {}

  showTextWall(text: string, options?: LayoutOptions): void {
    this.connection.sendMessage({
      id: this.generateId(),
      type: 'layout.showTextWall',
      timestamp: Date.now(),
      payload: { text, options }
    });
  }

  showDoubleTextWall(topText: string, bottomText: string, options?: LayoutOptions): void {
    this.connection.sendMessage({
      id: this.generateId(),
      type: 'layout.showDoubleTextWall',
      timestamp: Date.now(),
      payload: { topText, bottomText, options }
    });
  }

  showReferenceCard(title: string, text: string, options?: LayoutOptions): void {
    this.connection.sendMessage({
      id: this.generateId(),
      type: 'layout.showReferenceCard',
      timestamp: Date.now(),
      payload: { title, text, options }
    });
  }

  showDashboardCard(leftText: string, rightText: string, options?: LayoutOptions): void {
    this.connection.sendMessage({
      id: this.generateId(),
      type: 'layout.showDashboardCard',
      timestamp: Date.now(),
      payload: { leftText, rightText, options }
    });
  }

  private generateId(): string {
    return `msg-layout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export { ViewType };
