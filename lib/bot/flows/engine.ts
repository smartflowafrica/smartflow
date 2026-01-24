import prisma from '@/lib/prisma';
import { ChatFlow, FlowState, FlowResponse } from './types';
import { BookingFlow } from './booking';
import { StatusFlow } from './status';

export class FlowEngine {
    private flows: Map<string, ChatFlow> = new Map();

    constructor() {
        // Register flows
        this.registerFlow(new BookingFlow());
        this.registerFlow(new StatusFlow());
    }

    private registerFlow(flow: ChatFlow) {
        this.flows.set(flow.id, flow);
    }

    /**
     * Handles a message within a flow context.
     * Returns a response if the flow handled it, or null if no active flow / flow finished.
     */
    public async handleMessage(
        clientId: string,
        customerPhone: string,
        message: string,
        customerName?: string
    ): Promise<FlowResponse | null> {

        // 1. Get Conversation State
        const conversation = await prisma.conversation.findUnique({
            where: {
                clientId_customerPhone: { clientId, customerPhone }
            },
            select: { id: true, metadata: true }
        });

        if (!conversation) return null;

        const metadata = conversation.metadata as Record<string, any>;
        const flowState = metadata?.flowState as FlowState | undefined;

        // 2. If no active flow, return null (MessageProcessor will fallback to intent)
        if (!flowState) return null;

        const flow = this.flows.get(flowState.flowId);
        if (!flow) {
            // Unknown flow ID in DB? Clear it.
            await this.clearFlowState(conversation.id);
            return null;
        }

        // 3. Delegate to Flow
        const result = await flow.handle(
            flowState.step,
            message,
            flowState.data,
            { clientId, customerPhone, customerName }
        );

        // 4. Update State
        if (result.nextStep) {
            // Merge new data with existing data
            const newData = { ...flowState.data, ...(result.data || {}) };

            await this.updateFlowState(conversation.id, {
                flowId: flowState.flowId,
                step: result.nextStep,
                data: newData,
                lastUpdated: Date.now()
            });
        } else {
            // Flow finished (nextStep is undefined)
            await this.clearFlowState(conversation.id);
        }

        return result;
    }

    /**
     * Starts a new flow for a conversation
     */
    public async startFlow(
        clientId: string,
        customerPhone: string,
        flowId: string,
        initialData: Record<string, any> = {}
    ): Promise<void> {
        const conversation = await prisma.conversation.findUnique({
            where: { clientId_customerPhone: { clientId, customerPhone } }
        });

        if (!conversation) return; // Should likely create conversation if not exists, but MessageProcessor usually ensures it exists?

        const flow = this.flows.get(flowId);
        if (!flow) return;

        // Initial state
        const state: FlowState = {
            flowId,
            step: 'start',
            data: initialData,
            lastUpdated: Date.now()
        };

        // We don't execute 'start' logic here immediately, usually the *next* user message is 'start' trigger? 
        // OR the bot immediately responds.
        // For 'booking' intent, the user just said "I want to book". 
        // We should probably run the 'start' step immediately to get the first bot question.

        await this.updateFlowState(conversation.id, state);
    }

    // --- State Persistence ---

    private async updateFlowState(conversationId: string, state: FlowState) {
        await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                metadata: {
                    flowState: state
                }
            }
        });
    }

    private async clearFlowState(conversationId: string) {
        // We keep other metadata, just remove flowState
        // Prisma Json update limitations: easier to read-modify-write or just set flowState: null
        // But 'metadata' is replaced if we pass object.
        // For now, let's assume metadata ONLY holds flowState. If not, we need to merge.
        // To be safe: set flowState to null or undefined.

        // Fetch current to merge isn't atomic but safe enough for low volume
        const current = await prisma.conversation.findUnique({ where: { id: conversationId }, select: { metadata: true } });
        const meta = (current?.metadata as Record<string, any>) || {};
        delete meta.flowState;

        await prisma.conversation.update({
            where: { id: conversationId },
            data: { metadata: meta }
        });
    }
}
