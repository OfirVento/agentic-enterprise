'use client';

import { motion } from 'framer-motion';
import { DepartmentState, AgentTask, DeptKeys } from '@/store/useCPQStore';
import { AgentAvatar } from './AgentAvatar';
import { Database, Zap, FileSignature, Truck, HardDrive, DollarSign } from 'lucide-react';

interface DepartmentNodeProps {
    id: DeptKeys;
    label: string;
    state: DepartmentState;
    agents: AgentTask[];
    x: number;
    y: number;
}

const icons = {
    catalog: Database,
    cpq: Zap,
    contracts: FileSignature,
    orders: Truck,
    assets: HardDrive,
    billing: DollarSign,
};

const colors = {
    catalog: 'text-indigo-400 border-indigo-500/50 shadow-indigo-500/30',
    cpq: 'text-amber-400 border-amber-500/50 shadow-amber-500/30',
    contracts: 'text-blue-400 border-blue-500/50 shadow-blue-500/30',
    orders: 'text-orange-400 border-orange-500/50 shadow-orange-500/30',
    assets: 'text-cyan-400 border-cyan-500/50 shadow-cyan-500/30',
    billing: 'text-emerald-400 border-emerald-500/50 shadow-emerald-500/30',
};

const bgColors = {
    catalog: 'bg-indigo-600',
    cpq: 'bg-amber-500',
    contracts: 'bg-blue-600',
    orders: 'bg-orange-500',
    assets: 'bg-cyan-600',
    billing: 'bg-emerald-600',
};

// SVG rendering of a modern top-down desk
const SVGDesk = () => (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Desk Surface */}
        <rect x="5" y="10" width="50" height="20" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        {/* Monitor */}
        <rect x="20" y="5" width="20" height="4" rx="1" fill="#475569" />
        <rect x="28" y="9" width="4" height="6" fill="#475569" />
        {/* Keyboard */}
        <rect x="22" y="16" width="16" height="6" rx="1" fill="#0f172a" />
        {/* Plant */}
        <circle cx="12" cy="15" r="4" fill="#059669" />
        {/* Coffee Cup */}
        <circle cx="48" cy="15" r="3" fill="#cbd5e1" />
    </svg>
);

export function DepartmentNode({ id, label, state, agents, x, y }: DepartmentNodeProps) {
    const isExpanded = state === 'active';
    const isCompleted = state === 'completed';

    const Icon = icons[id];

    return (
        <motion.div
            className={`absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 ${isExpanded ? 'z-50' : 'z-10'}`}
            initial={{ left: x, top: y }}
            animate={{ 
              left: isExpanded ? '50%' : x, 
              top: isExpanded ? '50%' : y, 
              scale: isExpanded ? 1 : (isCompleted ? 0.9 : 0.8) 
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
            <motion.div
                layout
                className={`relative flex items-center justify-center rounded-2xl overflow-hidden backdrop-blur-3xl transition-all duration-300 pointer-events-auto
          ${isExpanded ? 'w-[90vw] md:w-[420px] h-[320px] p-0 bg-slate-900/95 border-2 ' + colors[id].split(' ')[1] : 'w-16 h-16 bg-slate-800 border-2 border-slate-700'}
          ${isExpanded ? 'shadow-[0_0_50px_rgba(0,0,0,0.8)] ' + colors[id].split(' ')[2] : ''}
          ${isCompleted ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10 bg-emerald-900/10' : ''}
        `}
            >
                {!isExpanded && (
                    <motion.div
                        className={`w-full h-full flex items-center justify-center rounded-2xl transition-colors duration-300
              ${isCompleted ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'}
            `}
                    >
                        <Icon size={24} />
                    </motion.div>
                )}

                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-full h-full flex flex-col relative"
                    >
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 h-12 bg-slate-950/80 border-b border-slate-800 flex items-center px-6 space-x-3 z-20 shadow-lg">
                            <Icon size={18} className={colors[id].split(' ')[0]} />
                            <div>
                                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">{label} TEAM</h3>
                                <p className="text-[10px] text-slate-400 font-mono tracking-wider">{agents.length} AGENTS ALLOCATED</p>
                            </div>
                        </div>

                        {/* Minimal 2D Office Floor Plan */}
                        <div className="flex-1 mt-12 relative bg-[#0B1221] overflow-hidden">
                            {/* Floor Grid Pattern */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                            {/* Desks and Agents Placement */}
                            <div className="absolute inset-0 pt-6 px-10 flex flex-row flex-wrap items-center justify-center gap-10">
                                {agents.map((agent) => {
                                    const isActive = agent.statusText !== 'Idle' && agent.statusText !== 'Done';

                                    return (
                                        <div key={agent.id} className={`relative flex flex-col items-center justify-center transition-all duration-700 ${isActive ? 'scale-110 z-30' : 'scale-90 opacity-70 z-10'}`}>
                                            {/* SVG Desk Base */}
                                            <div className="absolute bottom-0 z-0">
                                                <SVGDesk />
                                            </div>

                                            {/* Agent Avatar layered over desk */}
                                            <div className="z-10 mb-4">
                                                <AgentAvatar agent={agent} color={bgColors[id]} isActive={isActive} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Dramatic lighting overlay emphasizing the active agent conceptually */}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0B1221] via-transparent to-transparent opacity-50 z-40"></div>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {!isExpanded && (
                <motion.p className={`text-[10px] font-bold mt-2 tracking-widest uppercase transition-colors duration-300
          ${isCompleted ? 'text-emerald-500' : 'text-slate-500'}
        `}>
                    {label} TEAM
                </motion.p>
            )}
        </motion.div>
    );
}
