import { create } from 'zustand';

export type CPQPhase =
    | 'IDLE'
    | 'CATALOG_ACTIVE'
    | 'CPQ_ACTIVE'
    | 'PENDING_APPROVAL'
    | 'CONTRACTS_ACTIVE'
    | 'ORDERS_ACTIVE'
    | 'ASSETS_ACTIVE'
    | 'BILLING_ACTIVE'
    | 'COMPLETE';

export type DepartmentState = 'idle' | 'active' | 'completed';

export type AgentTask = {
    id: string;
    name: string;
    statusText: string;
};

export type ChatMessage = {
    id: string;
    role: 'user' | 'manager' | 'agent';
    agentName?: string;
    content: string;
    uiContextType?: 'diagram' | 'chart' | 'spreadsheet' | null;
    isApprovalRequest?: boolean;
};

export type DeptKeys = 'catalog' | 'cpq' | 'contracts' | 'orders' | 'assets' | 'billing';

interface CPQState {
    phase: CPQPhase;
    departments: Record<DeptKeys, DepartmentState>;
    agents: Record<DeptKeys, AgentTask[]>;
    chatMessages: ChatMessage[];

    // Actions
    setPhase: (phase: CPQPhase) => void;
    setDepartmentState: (dept: DeptKeys, state: DepartmentState) => void;
    updateAgentStatus: (dept: DeptKeys, agentId: string, statusText: string) => void;
    addChatMessage: (msg: Omit<ChatMessage, 'id'>) => void;
    approveAction: () => void;
    reset: () => void;
    startFlow: () => void;
}

const initialState = {
    phase: 'IDLE' as CPQPhase,
    departments: {
        catalog: 'idle',
        cpq: 'idle',
        contracts: 'idle',
        orders: 'idle',
        assets: 'idle',
        billing: 'idle',
    } as Record<DeptKeys, DepartmentState>,
    agents: {
        catalog: [
            { id: 'cat_1', name: 'Mia (Catalog)', statusText: 'Idle' },
            { id: 'cat_2', name: 'Tom (Integrations)', statusText: 'Idle' },
        ],
        cpq: [
            { id: 'cpq_1', name: 'Sarah (Pricing)', statusText: 'Idle' },
            { id: 'cpq_2', name: 'Alex (Rules)', statusText: 'Idle' },
            { id: 'cpq_3', name: 'Omer (Discount)', statusText: 'Idle' },
        ],
        contracts: [
            { id: 'con_1', name: 'David (Legal)', statusText: 'Idle' },
            { id: 'con_2', name: 'Elena (Compliance)', statusText: 'Idle' },
        ],
        orders: [
            { id: 'ord_1', name: 'Finn (Fulfillment)', statusText: 'Idle' },
            { id: 'ord_2', name: 'Gina (Logistics)', statusText: 'Idle' },
        ],
        assets: [
            { id: 'ass_1', name: 'Hank (Provisioning)', statusText: 'Idle' },
        ],
        billing: [
            { id: 'bil_1', name: 'Ivy (Invoicing)', statusText: 'Idle' },
            { id: 'bil_2', name: 'Jack (Receivables)', statusText: 'Idle' },
        ],
    },
    chatMessages: [
        {
            id: 'init_msg_1',
            role: 'manager' as const,
            agentName: 'Lead Orchestrator',
            content: 'Ready to start the Q2C (Quote-to-Cash) workflow. The autonomous teams are standing by.',
            isApprovalRequest: false,
        }
    ],
};

export const useCPQStore = create<CPQState>((set) => ({
    ...initialState,

    setPhase: (phase) => set({ phase }),

    setDepartmentState: (dept, state) => set((prev) => ({
        departments: {
            ...prev.departments,
            [dept]: state
        }
    })),

    updateAgentStatus: (dept, agentId, statusText) => set((prev) => ({
        agents: {
            ...prev.agents,
            [dept]: prev.agents[dept].map(agent =>
                agent.id === agentId ? { ...agent, statusText } : agent
            )
        }
    })),

    addChatMessage: (msg) => set((prev) => ({
        chatMessages: [...prev.chatMessages, { ...msg, id: Date.now().toString() + Math.random().toString() }]
    })),

    approveAction: () => set((prev) => ({
        phase: 'CONTRACTS_ACTIVE',
        departments: {
            ...prev.departments,
            cpq: 'completed',
            contracts: 'active'
        },
        chatMessages: [...prev.chatMessages, {
            id: Date.now().toString() + Math.random().toString(),
            role: 'user',
            content: 'Approved!',
            isApprovalRequest: false
        }]
    })),

    startFlow: () => set((prev) => ({
        phase: 'CATALOG_ACTIVE',
        departments: { ...prev.departments, catalog: 'active' },
        chatMessages: [
            ...prev.chatMessages,
            {
                id: Date.now().toString() + '1',
                role: 'user',
                content: 'Start a Q2C flow for Acme Corp enterprise deal.',
            },
            {
                id: Date.now().toString() + '2',
                role: 'manager',
                agentName: 'Lead Orchestrator',
                content: 'Spinning up the autonomous units. We will traverse Catalog, check CPQ logic, verify Contracts, and push to Orders, Assets, and Billing.',
            }
        ]
    })),

    reset: () => set(initialState)
}));
