'use client';

import { motion } from 'framer-motion';
import { AgentTask } from '@/store/useCPQStore';

export function AgentAvatar({ agent, color, isActive }: { agent: AgentTask, color: string, isActive: boolean }) {
  const isDone = agent.statusText === 'Done';

  // Parse Role from "Name (Role)" format
  const [name, roleMatch] = agent.name.split(' (');
  const role = roleMatch ? roleMatch.replace(')', '') : 'Specialist';

  // Deterministic mock stats based on agent name length
  const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const utilization = (50 + (charSum % 40)).toFixed(1);
  const tasksTD = 100 + (charSum % 800);
  const avgTime = (0.5 + (charSum % 20) / 10).toFixed(2);

  return (
    <div className={`flex flex-col items-center pointer-events-auto cursor-help relative transition-opacity duration-500 group ${!isActive && isDone ? 'opacity-60' : 'opacity-100'}`}>
      
      {/* State Bubble - Only show when actively working */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-16 w-[140px] z-[60] flex justify-center pointer-events-none"
      >
        <div className="bg-slate-900/95 rounded-xl p-3 border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.3)] backdrop-blur-md relative">
          <p className="text-[11px] text-slate-100 font-medium text-center leading-snug">
            {agent.statusText}
          </p>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-t-indigo-500/50 border-l-transparent border-r-transparent"></div>
        </div>
      </motion.div>

      {/* Hover Stats Popup */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 mt-2 w-44 p-3 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] opacity-0 scale-95 origin-top group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-[100]">
        <h4 className="text-slate-100 text-[11px] font-bold border-b border-slate-800 pb-1 mb-2 uppercase tracking-wider">{name} Details</h4>
        <div className="flex flex-col space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500 text-[9px] uppercase tracking-wide">Role:</span> <span className="text-indigo-300 font-semibold">{role}</span></div>
          <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500 text-[9px] uppercase tracking-wide">Usage:</span> <span className="text-emerald-400 font-semibold">{utilization}%</span></div>
          <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500 text-[9px] uppercase tracking-wide">Tasks:</span> <span className="text-amber-400 font-semibold">{tasksTD} (Today)</span></div>
          <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500 text-[9px] uppercase tracking-wide">Avg SLA:</span> <span className="text-cyan-400 font-semibold">{avgTime}s</span></div>
        </div>
      </div>

      {/* Avatar Container */}
      <div className="relative mt-8">
        
        {/* Glow orbit when active */}
        {isActive && (
          <motion.div 
             className="absolute inset-[-6px] rounded-full border-2 border-indigo-400 border-dashed opacity-70 z-0 pointer-events-none"
             animate={{ rotate: 360 }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        {/* The Avatar body */}
        <motion.div 
          animate={isActive ? { y: [-2, 2, -2] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-white font-bold text-sm shrink-0 z-10 relative ring-4 ring-slate-900
            ${isDone ? 'bg-slate-700' : color}
          `}
        >
          {isDone ? '✓' : name.charAt(0)}
        </motion.div>
        
        {/* Name tag */}
        <div className={`absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded shadow text-[10px] font-bold transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
           {name}
        </div>
      </div>
    </div>
  );
}
