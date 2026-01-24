export interface FlowState {
    flowId: string;
    step: string;
    data: Record<string, any>;
    lastUpdated: number;
}

export interface FlowResponse {
    response: string;
    nextStep?: string; // If undefined, flow ends
    data?: Record<string, any>; // Data to merge into state
    action?: 'reply' | 'escalate';
}

export interface ChatFlow {
    id: string;
    handle(
        step: string,
        message: string,
        data: Record<string, any>,
        context: { clientId: string; customerPhone: string; customerName?: string }
    ): Promise<FlowResponse>;
}
