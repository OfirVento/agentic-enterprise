'use client';

import { useEffect, useRef } from 'react';
import { useCPQStore } from '@/store/useCPQStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, CheckCircle, Send, Bot, FileSpreadsheet, BarChart2 } from 'lucide-react';

export function ManagerChat() {
    const { phase, chatMessages, startFlow, approveAction } = useCPQStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const showApproveButton = phase === 'PENDING_APPROVAL';
    const isIdle = phase === 'IDLE';

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="bg-slate-950/50 p-6 border-b border-slate-800 flex flex-row items-center space-x-4 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Bot size={20} className="text-white" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-white tracking-wide">Orchestration Center</h2>
                    <p className="text-xs font-mono text-emerald-400">System Online • 6 Autonomous Hubs</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-700 bg-slate-900/30">
                <AnimatePresence initial={false}>
                    {chatMessages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            {msg.role !== 'user' && (
                                <span className="text-xs font-semibold text-slate-400 mb-1 ml-1 flex flex-row items-center gap-1">
                                    {msg.agentName === 'Lead Orchestrator' ? <MessageSquare size={10} className="text-blue-400" /> : <Bot size={10} className="text-indigo-400" />}
                                    {msg.agentName}
                                </span>
                            )}

                            <div
                                className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-sm shadow-blue-500/10'
                                        : msg.role === 'agent'
                                            ? 'bg-slate-800 text-slate-300 border border-slate-700/50 rounded-tl-sm shadow-black/50'
                                            : 'bg-slate-800/80 text-white border border-indigo-500/30 rounded-tl-sm shadow-indigo-500/10'
                                    }`}
                            >
                                {msg.content}

                                {/* Visual Contexts mock */}
                                {msg.uiContextType === 'spreadsheet' && (
                                    <div className="mt-3 p-3 bg-slate-900 rounded-lg border border-slate-700 font-mono text-xs flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-emerald-400 pb-2 border-b border-slate-800"><FileSpreadsheet size={14} /> Pricing Matrix Analysis</div>
                                        <div className="grid grid-cols-3 gap-2 text-slate-400">
                                            <span>Tier</span><span>Base</span><span>Discount</span>
                                            <span className="text-slate-200">Standard</span><span>$10k</span><span>0%</span>
                                            <span className="text-indigo-300">Enterprise</span><span>$50k</span><span className="text-green-400 font-bold">20%</span>
                                        </div>
                                    </div>
                                )}
                                {msg.uiContextType === 'diagram' && (
                                    <div className="mt-3 p-3 bg-slate-900 rounded-lg border border-slate-700 font-mono text-xs flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-blue-400 pb-2 border-b border-slate-800"><BarChart2 size={14} /> Rule Conflict Identified</div>
                                        <div className="h-16 w-full flex items-center justify-between px-4 text-slate-500 text-[10px]">
                                            <div className="p-2 border border-rose-500/50 bg-rose-500/10 text-rose-300 rounded">Promo Code</div>
                                            <div className="h-px bg-slate-700 flex-1 mx-2"></div>
                                            <div className="p-1 bg-amber-500 text-black font-bold rotate-45 transform origin-center text-center leading-none">!</div>
                                            <div className="h-px bg-slate-700 flex-1 mx-2"></div>
                                            <div className="p-2 border border-blue-500/50 bg-blue-500/10 text-blue-300 rounded">Volume Tier</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Action Area */}
            <div className="p-6 bg-slate-950/80 border-t border-slate-800 flex flex-col justify-center space-y-4 shrink-0 backdrop-blur-md">
                {isIdle ? (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startFlow}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all border border-blue-500/50"
                    >
                        <Send size={18} />
                        <span>Start Q2C Flow: Acme Corp</span>
                    </motion.button>
                ) : showApproveButton ? (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={approveAction}
                        className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-4 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all border border-emerald-400/50 ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-slate-900"
                    >
                        <CheckCircle size={18} />
                        <span>Approve Resolution & Proceed</span>
                    </motion.button>
                ) : (
                    <div className="w-full text-center text-xs text-slate-500 font-mono tracking-wider flex items-center justify-center space-x-3 py-4 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span>AGENTS ORCHESTRATING...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
