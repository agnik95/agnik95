import React, { useState } from 'react';
import { useAppContext } from '../store';
import { User, Bell, ChevronLeft, Menu, Moon, Sun, ScanLine } from 'lucide-react';
import { UserRole } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export function Shell({ children }: { children: React.ReactNode }) {
  const { role, setRole, currentView, navigate, theme, toggleTheme, notifications, clearNotifications } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as UserRole);
  };

  const isHome = currentView === 'launchpad';
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-fiori-shell flex flex-col font-sans transition-colors duration-300">
      {/* Fiori Shell Header (Horizon Theme) */}
      <header className="h-[2.75rem] bg-[var(--bg-shell)] text-white flex items-center justify-between px-4 shadow-sm z-50">
        <div className="flex items-center gap-2 md:gap-4">
          {!isHome ? (
            <button 
              onClick={() => navigate('launchpad')}
              className="p-1 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center shrink-0"
              title="Home"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
             <div className="w-[28px]" />
          )}
          
          <div className="flex items-center gap-3">
             <div className="text-xl font-bold tracking-tight select-none cursor-pointer" onClick={() => navigate('launchpad')}>
               SAP
             </div>
             <div className="h-4 w-px bg-white/30 hidden sm:block" />
             <span className="text-sm font-semibold hidden sm:block select-none truncate max-w-[150px] md:max-w-none">
               Gate Pass Management
             </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
           {role === 'Security' && (
             <button title="Scanner" onClick={() => navigate('scanner')} className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
               <ScanLine size={18} />
             </button>
           )}

           <div className="hidden md:flex items-center gap-2 mr-0 md:mr-4 bg-white/10 rounded-md px-2 py-1">
             <span className="text-xs font-semibold text-white/80">Role:</span>
             <select 
               value={role} 
               onChange={handleRoleChange}
               className="bg-transparent text-sm text-white focus:outline-none focus:ring-0 [&>option]:text-black border-none"
             >
               <option value="Employee">Employee</option>
               <option value="Approver">Approver/Manager</option>
               <option value="Security">Security Officer</option>
               <option value="Admin">Admin</option>
             </select>
           </div>
           
           <button onClick={toggleTheme} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Toggle Theme">
             {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
           </button>

           <div className="relative">
             <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
             >
               <Bell size={18} />
               {unreadCount > 0 && (
                 <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
               )}
             </button>
             {showNotifications && (
               <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-lg shadow-xl overflow-hidden z-50 text-[var(--text-main)]">
                 <div className="p-3 border-b border-[var(--border-light)] flex justify-between items-center bg-[var(--bg-main)]">
                   <h3 className="text-sm font-semibold">Notifications</h3>
                   <button onClick={clearNotifications} className="text-xs text-[#0a6ed1] hover:underline">Clear All</button>
                 </div>
                 <div className="max-h-80 overflow-y-auto">
                   {notifications.length > 0 ? notifications.map(notif => (
                     <div 
                        key={notif.id} 
                        className="p-3 border-b border-[var(--border-light)] hover:bg-[var(--bg-main)] cursor-pointer text-sm"
                        onClick={() => {
                          setShowNotifications(false);
                          if(notif.gatePassId) navigate('objectPage', { id: notif.gatePassId });
                        }}
                     >
                       <div className="mb-1">{notif.message}</div>
                       <div className="text-xs text-[var(--text-muted)]">{format(new Date(notif.date), 'PPp')}</div>
                     </div>
                   )) : (
                     <div className="p-4 text-center text-[var(--text-muted)] text-sm">No new notifications</div>
                   )}
                 </div>
               </div>
             )}
           </div>

           <button className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-[#0a6ed1] hover:bg-[#085ab0] transition-colors overflow-hidden border border-white/20 ml-1">
             <User size={16} />
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto relative p-2 sm:p-4 bg-[var(--bg-main)]">
        <div className="max-w-[1400px] mx-auto w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
