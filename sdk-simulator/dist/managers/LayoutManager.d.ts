import { SimulatorConnection } from '../connection/SimulatorConnection';
import { ViewType, LayoutOptions } from '../types';
export declare class LayoutManager {
    private connection;
    constructor(connection: SimulatorConnection);
    showTextWall(text: string, options?: LayoutOptions): void;
    showDoubleTextWall(topText: string, bottomText: string, options?: LayoutOptions): void;
    showReferenceCard(title: string, text: string, options?: LayoutOptions): void;
    showDashboardCard(leftText: string, rightText: string, options?: LayoutOptions): void;
    private generateId;
}
export { ViewType };
//# sourceMappingURL=LayoutManager.d.ts.map