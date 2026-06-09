import React, { useState } from 'react';
import { useAppContext } from '../store';
import { GatePass, PassType, GatePassStatus } from '../types';
import { Filter, Search, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export function ManageGatePasses() {
  const { gatePasses, navigate } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<GatePassStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<PassType | 'All'>('All');

  const filteredPasses = gatePasses.filter(pass => {
    const matchesSearch = 
      pass.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pass.visitorName && pass.visitorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pass.vehicleNumber && pass.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || pass.status === statusFilter;
    const matchesType = typeFilter === 'All' || pass.passType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Title & Actions */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">Manage Gate Passes</h1>
        <button 
          onClick={() => navigate('createGatePass')}
          className="bg-[#0a6ed1] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#085ab0] transition-colors"
        >
          Create Request
        </button>
      </div>

      {/* Smart Filter Bar */}
      <div className="bg-[var(--bg-card)] p-4 rounded-t-lg border-b border-[var(--border-light)] shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[var(--text-main)] font-medium mb-1">
          <Filter size={16} /> Filter Bar
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex w-full bg-[var(--bg-main)] rounded overflow-hidden p-1 border-b border-transparent focus-within:border-[#0a6ed1] transition-colors">
             <Search className="text-[var(--text-muted)] m-1" size={18} />
             <input 
               type="text" 
               placeholder="Search Pass ID, Name..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-main)] placeholder-[var(--text-muted)]"
             />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border-none text-sm p-2 outline-none rounded border-b border-transparent focus:border-[#0a6ed1]"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Manager Approval">Manager Approval</option>
            <option value="Security Approval">Security Approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border-none text-sm p-2 outline-none rounded border-b border-transparent focus:border-[#0a6ed1]"
          >
            <option value="All">All Types</option>
            <option value="Visitor">Visitor</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Material">Material</option>
          </select>

          <div className="flex justify-end items-center">
            <span className="text-sm text-[var(--text-muted)] font-medium">Items: {filteredPasses.length}</span>
          </div>
        </div>
      </div>

      {/* Smart Table */}
      <div className="bg-[var(--bg-card)] shadow-sm rounded-b-lg flex-1 overflow-auto border-t-0">
        <table className="w-full text-left text-sm text-[var(--text-main)]">
          <thead className="bg-[var(--bg-main)] text-xs uppercase text-[var(--text-muted)] sticky top-0 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 font-semibold">Pass ID</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Details</th>
              <th className="px-4 py-3 font-semibold">Requester</th>
              <th className="px-4 py-3 font-semibold hidden md:table-cell">Department</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-light)]">
            {filteredPasses.length > 0 ? filteredPasses.map((pass) => (
              <tr 
                key={pass.id} 
                onClick={() => navigate('objectPage', { id: pass.id })}
                className="hover:bg-[var(--bg-main)] cursor-pointer transition-colors group"
              >
                <td className="px-4 py-4 font-medium text-[#0a6ed1]">{pass.id}</td>
                <td className="px-4 py-4">{pass.passType}</td>
                <td className="px-4 py-4 truncate max-w-[150px]">
                  {pass.passType === 'Visitor' && pass.visitorName}
                  {pass.passType === 'Vehicle' && pass.vehicleNumber}
                  {pass.passType === 'Material' && pass.materialDescription}
                </td>
                <td className="px-4 py-4">{pass.employeeName}</td>
                <td className="px-4 py-4 text-[var(--text-muted)] hidden md:table-cell">{pass.department}</td>
                <td className="px-4 py-4 text-[var(--text-muted)] hidden sm:table-cell">
                  {format(new Date(pass.requestDate), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={pass.status} />
                </td>
                <td className="px-4 py-4 text-[var(--text-muted)] group-hover:text-[#0a6ed1]">
                  <ChevronRight size={18} />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[var(--text-muted)]">
                  No gate passes found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: GatePassStatus }) {
  const styles: Record<string, string> = {
    'Draft': 'bg-gray-100 text-gray-800',
    'Submitted': 'bg-blue-100 text-blue-800',
    'Manager Approval': 'bg-yellow-100 text-yellow-800',
    'Security Approval': 'bg-orange-100 text-orange-800',
    'Approved': 'bg-green-100 text-green-800',
    'Closed': 'bg-[#e5f0fa] text-[#0a6ed1]',
    'Rejected': 'bg-red-100 text-red-800',
  };

  return (
    <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-sm", styles[status] || styles['Draft'])}>
      {status}
    </span>
  );
}
