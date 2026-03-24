'use client';

import { useEffect, useState, useRef } from 'react';
import { useCPQStore } from '@/store/useCPQStore';
import { DepartmentNode } from './DepartmentNode';
import { motion } from 'framer-motion';

export function MapCanvas() {
  const { departments, agents } = useCPQStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (!containerRef.current) return;
    
    // Use ResizeObserver for perfect dynamic sizing based on the actual container, 
    // replacing the hardcoded window.innerWidth math.
    const observer = new ResizeObserver((entries) => {
      setSize({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height,
      });
    });
    
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  if (!mounted) {
     return <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#0a0f1c]" />;
  }

  const width = size.width;
  const height = size.height;

  // Responsive padding logic. Shortens connection lines dynamically to ensure 
  // they never overflow the active view window.
  const marginX = Math.max(width * 0.15, 50); // Minimum 50px away from edge
  const paddingX = Math.min(width * 0.85, width - 50);
  const midX = width / 2;

  const marginY = Math.max(height * 0.25, 80);
  const bottomY = Math.min(height * 0.75, height - 80);

  // Layout in a beautifully centered U-shape flow
  const pos = {
    catalog: { x: marginX, y: marginY },
    cpq: { x: midX, y: marginY },
    contracts: { x: paddingX, y: marginY },
    orders: { x: paddingX, y: bottomY },
    assets: { x: midX, y: bottomY },
    billing: { x: marginX, y: bottomY },
  };

  const isActive = (dept: string) => departments[dept as keyof typeof departments] !== 'idle';
  const isComplete = (dept: string) => departments[dept as keyof typeof departments] === 'completed';

  const renderLine = (start: {x:number, y:number}, end: {x:number, y:number}, active: boolean, previousComplete: boolean) => {
    const isRunning = active && !previousComplete;
    return (
      <g key={`${start.x}-${end.x}`}>
        <path
          d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
          stroke="#1e293b"
          strokeWidth="3"
          fill="none"
          strokeDasharray="8 8"
        />
        <motion.path
          d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
          stroke="url(#line-gradient)"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: active ? 1 : 0, 
            opacity: active ? 1 : 0 
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        {isRunning && (
          <motion.circle
            r="4"
            fill="#10b981"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ offsetPath: `path('M ${start.x} ${start.y} L ${end.x} ${end.y}')` } as any}
          />
        )}
      </g>
    );
  };

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#0a0f1c] overflow-hidden">
      {size.width > 0 && size.height > 0 && (
        <>
          {/* Background Grid */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)', 
              backgroundSize: '32px 32px' 
            }}
          />
          
          {/* Connecting Logic Lines */}
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            
            {renderLine(pos.catalog, pos.cpq, isActive('cpq'), isComplete('cpq'))}
            {renderLine(pos.cpq, pos.contracts, isActive('contracts'), isComplete('contracts'))}
            {renderLine(pos.contracts, pos.orders, isActive('orders'), isComplete('orders'))}
            {renderLine(pos.orders, pos.assets, isActive('assets'), isComplete('assets'))}
            {renderLine(pos.assets, pos.billing, isActive('billing'), isComplete('billing'))}
          </svg>

          {/* Department Nodes */}
          <div className="relative z-10 w-full h-full pointer-events-none">
            {Object.entries(departments).map(([key, state]) => (
              <DepartmentNode 
                key={key}
                id={key as keyof typeof departments}
                label={key}
                state={state} 
                agents={agents[key as keyof typeof departments]} 
                x={pos[key as keyof typeof pos].x} 
                y={pos[key as keyof typeof pos].y} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
