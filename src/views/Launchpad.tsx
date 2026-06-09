import React from 'react';
import { FioriTile } from '../components/FioriTile';
import { LayoutDashboard, FileText, PlusCircle, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { useAppContext } from '../store';

export function Launchpad() {
  const { role, gatePasses } = useAppContext();

  const pendingApprovals = gatePasses.filter(p => {
    if (role === 'Approver') return p.status === 'Manager Approval';
    if (role === 'Security') return p.status === 'Security Approval';
    return false;
  }).length;

  const totalPasses = gatePasses.length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h1 className="text-2xl font-semibold text-[var(--text-main)] mb-6">Home</h1>
      
      <div className="mb-8">
        <h2 className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase mb-4">Gate Pass Operations</h2>
        <div className="flex flex-wrap gap-4">
          <FioriTile
            title="Dashboard"
            subtitle="Analytics & KPIs"
            icon={LayoutDashboard}
            targetView="dashboard"
          />
          
          <FioriTile
            title="Create Gate Pass"
            subtitle="New Request"
            icon={PlusCircle}
            targetView="createGatePass"
          />

          <FioriTile
            title="Manage Passes"
            subtitle="View all passes"
            icon={FileText}
            number={totalPasses}
            info="Total requests"
            targetView="manageGatePasses"
          />
          
          {(role === 'Approver' || role === 'Security' || role === 'Admin') && (
            <FioriTile
              title="Approvals"
              subtitle="Pending my review"
              icon={ShieldCheck}
              number={pendingApprovals}
              colorClass={pendingApprovals > 0 ? 'text-[#e52929] dark:text-red-400' : 'text-[#2b7d2b] dark:text-green-400'}
              info="Requires action"
              targetView="manageGatePasses"
            />
          )}

          {(role === 'Admin' || role === 'Security') && (
            <FioriTile
              title="Reports"
              subtitle="Export details"
              icon={FileSpreadsheet}
              targetView="reports"
            />
          )}
        </div>
      </div>
    </div>
  );
}
