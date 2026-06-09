import React, { useState } from 'react';
import { useAppContext } from '../store';
import { ScanLine, Search } from 'lucide-react';

export function ScannerView() {
  const { navigate, gatePasses, addNotification } = useAppContext();
  const [scanId, setScanId] = useState('');

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const pass = gatePasses.find(p => p.id === scanId);
    if(pass) {
      navigate('objectPage', { id: scanId });
    } else {
      addNotification(`Gate Pass ${scanId} not found.`);
      setScanId('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] animate-in fade-in zoom-in duration-300">
      <div className="bg-[var(--bg-card)] border border-[var(--border-light)] p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
         
         <div className="w-24 h-24 bg-[var(--bg-main)] rounded-full flex items-center justify-center mb-6 border-4 border-[#0a6ed1]/20 text-[#0a6ed1]">
            <ScanLine size={40} className="animate-pulse" />
         </div>

         <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">Gate Scanner</h2>
         <p className="text-[var(--text-muted)] text-center text-sm mb-8">
           Point the scanner at the visitor or vehicle QR code, or manually enter the pass ID below.
         </p>

         <form onSubmit={handleScan} className="w-full flex gap-2">
            <div className="flex-1 flex items-center bg-[var(--bg-main)] border border-[var(--border-light)] rounded-lg px-3 overflow-hidden focus-within:border-[#0a6ed1] transition-colors">
              <Search size={18} className="text-[var(--text-muted)]" />
              <input 
                type="text" 
                value={scanId}
                onChange={e => setScanId(e.target.value.toUpperCase())}
                placeholder="e.g. GP-10001"
                className="w-full bg-transparent border-none outline-none p-2 text-[var(--text-main)] placeholder-[var(--text-muted)]"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              disabled={!scanId}
              className="px-6 bg-[#0a6ed1] text-white font-semibold rounded-lg hover:bg-[#085ab0] transition-colors disabled:opacity-50"
            >
               Verify
            </button>
         </form>
         
         <div className="mt-8 pt-6 border-t border-[var(--border-light)] w-full text-center">
            <p className="text-xs text-[var(--text-muted)]">Live Video Feed Mock - Only available on mobile devices.</p>
         </div>
      </div>
    </div>
  )
}
