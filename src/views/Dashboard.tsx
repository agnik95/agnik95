import React, { useMemo } from 'react';
import { useAppContext } from '../store';
import { GatePass } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { gatePasses } = useAppContext();

  const stats = useMemo(() => {
    return {
      total: gatePasses.length,
      pending: gatePasses.filter(p => ['Submitted', 'Manager Approval', 'Security Approval'].includes(p.status)).length,
      approved: gatePasses.filter(p => p.status === 'Approved').length,
      rejected: gatePasses.filter(p => p.status === 'Rejected').length,
      closed: gatePasses.filter(p => p.status === 'Closed').length,
      visitorCards: gatePasses.filter(p => p.passType === 'Visitor').length,
      vehicleMovement: gatePasses.filter(p => p.passType === 'Vehicle').length,
      materialMovement: gatePasses.filter(p => p.passType === 'Material').length,
    };
  }, [gatePasses]);

  const typeData = [
    { name: 'Visitors', value: stats.visitorCards, color: '#0a6ed1' },
    { name: 'Vehicles', value: stats.vehicleMovement, color: '#f58b00' },
    { name: 'Materials', value: stats.materialMovement, color: '#e52929' },
  ];

  const statusData = [
    { name: 'Pending', count: stats.pending },
    { name: 'Approved', count: stats.approved },
    { name: 'Rejected', count: stats.rejected },
    { name: 'Closed', count: stats.closed },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h1 className="text-2xl font-semibold text-[var(--text-main)] mb-6">Overview Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
         <KPICard title="Total Passes" value={stats.total} className="border-l-4 border-l-[#0a6ed1]" />
         <KPICard title="Pending Approval" value={stats.pending} className="border-l-4 border-l-[#f58b00]" />
         <KPICard title="Approved passes" value={stats.approved} className="border-l-4 border-l-[#2b7d2b]" />
         <KPICard title="Rejected" value={stats.rejected} className="border-l-4 border-l-[#e52929]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass Type Distribution */}
        <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm border border-[var(--border-light)] h-[350px]">
          <h3 className="text-lg font-medium text-[var(--text-main)] mb-4">Distribution by Pass Type</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Overview */}
        <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm border border-[var(--border-light)] h-[350px]">
          <h3 className="text-lg font-medium text-[var(--text-main)] mb-4">Passes by Status</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
              <RechartsTooltip cursor={{fill: 'var(--bg-shell)'}} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)', color: 'var(--text-main)' }} />
              <Bar dataKey="count" fill="#0a6ed1" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, className }: { title: string, value: number, className?: string }) {
  return (
    <div className={`bg-[var(--bg-card)] p-4 rounded-lg shadow-sm border border-[var(--border-light)] ${className}`}>
      <h3 className="text-sm text-[var(--text-muted)] font-medium mb-1">{title}</h3>
      <div className="text-3xl font-light text-[var(--text-main)]">{value}</div>
    </div>
  )
}
