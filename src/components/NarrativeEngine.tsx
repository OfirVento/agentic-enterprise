'use client';

import { useEffect, useRef } from 'react';
import { useCPQStore, DeptKeys } from '@/store/useCPQStore';

export function NarrativeEngine() {
    const { phase, updateAgentStatus, setPhase, addChatMessage, setDepartmentState } = useCPQStore();
    const isRunning = useRef(false);

    useEffect(() => {
        // Helper to sleep linearly
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const runFlow = async () => {
            if (isRunning.current) return;
            isRunning.current = true;

            try {
                if (phase === 'CATALOG_ACTIVE') {
                    // Linear: Agent 1 works
                    updateAgentStatus('catalog', 'cat_1', 'Verifying Acme product availability...');
                    await delay(2500);
                    updateAgentStatus('catalog', 'cat_1', 'Done');

                    // Linear: Agent 2 works
                    updateAgentStatus('catalog', 'cat_2', 'Syncing SKU definitions from CRM...');
                    await delay(2500);
                    updateAgentStatus('catalog', 'cat_2', 'Done');

                    // Area finished, return to chat
                    addChatMessage({
                        role: 'agent',
                        agentName: 'Mia (Catalog)',
                        content: 'Acme SKU bundle is in stock and synchronized. Moving data to CPQ.',
                    });
                    await delay(2000);

                    setDepartmentState('catalog', 'completed');
                    setPhase('CPQ_ACTIVE');
                    setDepartmentState('cpq', 'active');
                }

                else if (phase === 'CPQ_ACTIVE') {
                    // Linear Agent 1
                    updateAgentStatus('cpq', 'cpq_1', 'Configuring base price...');
                    await delay(2500);
                    updateAgentStatus('cpq', 'cpq_1', 'Done');

                    await delay(500);
                    addChatMessage({
                        role: 'agent',
                        agentName: 'Sarah (Pricing)',
                        content: 'Base price calculated at $50,000 for the Enterprise Tier.',
                        uiContextType: 'spreadsheet'
                    });
                    await delay(2500);

                    // Linear Agent 2
                    updateAgentStatus('cpq', 'cpq_2', 'Checking active rules...');
                    await delay(2500);
                    updateAgentStatus('cpq', 'cpq_2', 'Rule conflict detected!');
                    await delay(1500);
                    updateAgentStatus('cpq', 'cpq_2', 'Done');

                    // Linear Agent 3
                    updateAgentStatus('cpq', 'cpq_3', 'Evaluating standard discount...');
                    await delay(2000);
                    updateAgentStatus('cpq', 'cpq_3', 'Done');

                    // Area finished, chat handles the conflict
                    addChatMessage({
                        role: 'agent',
                        agentName: 'Alex (Rules)',
                        content: 'I caught a logic conflict: The account has a 10% promo code, but the volume tier qualifies for a 20% discount. They usually cannot stack.',
                        uiContextType: 'diagram'
                    });
                    await delay(3000);

                    addChatMessage({
                        role: 'manager',
                        agentName: 'Lead Orchestrator',
                        content: 'Please confirm how you want to resolve this. We recommend granting the 20% volume discount to close the deal and ignoring the promo code.',
                        isApprovalRequest: true,
                    });
                    setPhase('PENDING_APPROVAL');
                }

                else if (phase === 'CONTRACTS_ACTIVE') {
                    // Linear Agent 1
                    updateAgentStatus('contracts', 'con_1', 'Drafting MSA...');
                    await delay(2500);
                    updateAgentStatus('contracts', 'con_1', 'Done');

                    // Linear Agent 2
                    updateAgentStatus('contracts', 'con_2', 'Validating discount clauses...');
                    await delay(2500);
                    updateAgentStatus('contracts', 'con_2', 'Done');

                    addChatMessage({
                        role: 'agent',
                        agentName: 'David (Legal)',
                        content: 'MSA generated with the approved 20% discount clause added to terms.',
                    });
                    await delay(2000);

                    setDepartmentState('contracts', 'completed');
                    setPhase('ORDERS_ACTIVE');
                    setDepartmentState('orders', 'active');
                }

                else if (phase === 'ORDERS_ACTIVE') {
                    updateAgentStatus('orders', 'ord_1', 'Routing fulfillment logistics...');
                    await delay(2000);
                    updateAgentStatus('orders', 'ord_1', 'Done');

                    updateAgentStatus('orders', 'ord_2', 'Acquiring logistics data...');
                    await delay(2000);
                    updateAgentStatus('orders', 'ord_2', 'Done');

                    setDepartmentState('orders', 'completed');
                    setPhase('ASSETS_ACTIVE');
                    setDepartmentState('assets', 'active');
                }

                else if (phase === 'ASSETS_ACTIVE') {
                    updateAgentStatus('assets', 'ass_1', 'Provisioning cloud instances...');
                    await delay(2500);
                    updateAgentStatus('assets', 'ass_1', 'Done');

                    setDepartmentState('assets', 'completed');
                    setPhase('BILLING_ACTIVE');
                    setDepartmentState('billing', 'active');
                }

                else if (phase === 'BILLING_ACTIVE') {
                    updateAgentStatus('billing', 'bil_1', 'Generating final invoice...');
                    await delay(2000);
                    updateAgentStatus('billing', 'bil_1', 'Done');

                    updateAgentStatus('billing', 'bil_2', 'Logging receivable pending...');
                    await delay(2000);
                    updateAgentStatus('billing', 'bil_2', 'Done');

                    setDepartmentState('billing', 'completed');
                    addChatMessage({
                        role: 'manager',
                        agentName: 'Lead Orchestrator',
                        content: 'Transaction sealed! Contract executed, cloud environments provisioned, and invoice emitted automatically. End-to-end autonomous flow completed! 🎉',
                    });
                    setPhase('COMPLETE');
                }

            } finally {
                isRunning.current = false;
            }
        };

        runFlow();
    }, [phase, updateAgentStatus, setPhase, addChatMessage, setDepartmentState]);

    return null;
}
