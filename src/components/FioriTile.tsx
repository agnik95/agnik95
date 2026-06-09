import React from 'react';
import { cn } from '../lib/utils';
import { useAppContext } from '../store';

interface FioriTileProps {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  info?: string;
  number?: string | number;
  numberUnit?: string;
  targetView: string;
  trend?: 'up' | 'down' | 'neutral';
  colorClass?: string;
}

export function FioriTile({ 
  title, subtitle, icon: Icon, info, number, numberUnit, targetView, trend, colorClass 
}: FioriTileProps) {
  const { navigate } = useAppContext();

  return (
    <div 
      onClick={() => navigate(targetView)}
      className="group w-[11rem] h-[11rem] bg-[var(--bg-card)] rounded-lg shadow-sm hover:shadow-md border border-[var(--border-light)] p-4 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
    >
      <div>
        <h3 className="text-[var(--text-main)] font-medium text-[1rem] leading-tight line-clamp-2">{title}</h3>
        {subtitle && <p className="text-[var(--text-muted)] text-xs mt-1">{subtitle}</p>}
      </div>

      <div className="flex justify-between items-end">
        <div className="flex flex-col">
           {number !== undefined && (
             <div className="flex items-baseline gap-1 mt-2">
               <span className={cn("text-[2rem] font-light leading-none", colorClass || "text-[var(--text-main)]")}>
                 {number}
               </span>
               {numberUnit && <span className="text-[var(--text-muted)] text-sm">{numberUnit}</span>}
             </div>
           )}
           {info && <span className="text-[var(--text-muted)] text-xs mt-1">{info}</span>}
        </div>
        
        <div className="text-[#0a6ed1] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
          <Icon size={24} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
