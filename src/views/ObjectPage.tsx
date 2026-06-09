import React, { useState } from 'react';
import { useAppContext } from '../store';
import { StatusBadge } from './ManageGatePasses';
import { format } from 'date-fns';
import { User, Truck, Package, Clock, MessageSquare, Check, X, Paperclip, QrCode } from 'lucide-react';
import { GatePassStatus } from '../types';
import QRCode from 'react-qr-code';

export function ObjectPage() {
  const { viewParams, gatePasses, role, updateGatePassStatus, navigate } = useAppContext();
  const id = viewParams?.id;
  const pass = gatePasses.find(p => p.id === id);
  const [comment, setComment] = useState('');

  if (!pass) {
    return <div className="p-4 text-center mt-10 text-[var(--text-main)]">Gate Pass not found.</div>;
  }

  const canApprove = () => {
    if (role === 'Approver' && pass.status === 'Manager Approval') return true;
    if (role === 'Security' && pass.status === 'Security Approval') return true;
    if (role === 'Admin' && ['Submitted', 'Manager Approval', 'Security Approval'].includes(pass.status)) return true;
    return false;
  };

  const handleAction = (action: 'approve' | 'reject') => {
    let nextStatus: GatePassStatus = pass.status;
    if (action === 'approve') {
       if (pass.status === 'Submitted') nextStatus = 'Manager Approval';
       else if (pass.status === 'Manager Approval') nextStatus = 'Security Approval';
       else if (pass.status === 'Security Approval') nextStatus = 'Approved';
    } else {
       nextStatus = 'Rejected';
    }
    
    updateGatePassStatus(pass.id, nextStatus, comment);
    setComment('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-300">
      
      {/* Dynamic Page Header */}
      <div className="bg-[var(--bg-card)] shadow-sm px-6 py-4 flex flex-col mb-4 border border-[var(--border-light)] rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#e5f0fa] dark:bg-[var(--bg-shell)] text-[#0a6ed1] flex items-center justify-center rounded-lg text-xl shadow-inner">
               {pass.passType === 'Visitor' && <User />}
               {pass.passType === 'Vehicle' && <Truck />}
               {pass.passType === 'Material' && <Package />}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[var(--text-main)]">{pass.id}</h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">{pass.passType} Pass Request</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={pass.status} />
            {canApprove() && (
              <div className="flex gap-2 ml-4">
                <button onClick={() => handleAction('reject')} className="px-4 py-2 bg-[var(--bg-card)] border border-[#e52929] text-[#e52929] hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold rounded transition-colors flex items-center gap-1">
                  <X size={16}/> Reject
                </button>
                <button onClick={() => handleAction('approve')} className="px-4 py-2 bg-[#0a6ed1] text-white hover:bg-[#085ab0] text-sm font-semibold rounded transition-colors flex items-center gap-1">
                  <Check size={16}/> Approve
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Header Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
           <div>
             <div className="text-[var(--text-muted)] mb-1">Requester</div>
             <div className="font-medium text-[var(--text-main)]">{pass.employeeName}</div>
             <div className="text-xs text-[var(--text-muted)] opacity-80">{pass.department}</div>
           </div>
           <div>
             <div className="text-[var(--text-muted)] mb-1">Date Requested</div>
             <div className="font-medium text-[var(--text-main)]">{format(new Date(pass.requestDate), 'PPp')}</div>
           </div>
           <div>
             <div className="text-[var(--text-muted)] mb-1">Entry Expected</div>
             <div className="font-medium text-green-600 dark:text-green-500">{format(new Date(pass.entryDateTime), 'PPp')}</div>
           </div>
           <div>
             <div className="text-[var(--text-muted)] mb-1">Exit Expected</div>
             <div className="font-medium text-amber-600 dark:text-amber-500">{format(new Date(pass.exitDateTime), 'PPp')}</div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex flex-col lg:flex-row gap-4">
        
        {/* Main Content Sections */}
        <div className="flex-1 flex flex-col gap-4">
          
          <div className="bg-[var(--bg-card)] p-6 shadow-sm border-t-2 border-t-[#0a6ed1] rounded-lg">
            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-4">Request Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
               
               {pass.passType === 'Visitor' && (
                 <>
                   <DetailItem label="Visitor Name" value={pass.visitorName} />
                   <DetailItem label="Visitor Company" value={pass.visitorCompany} />
                 </>
               )}

               {pass.passType === 'Vehicle' && (
                 <>
                   <DetailItem label="Vehicle Number" value={pass.vehicleNumber} />
                   <DetailItem label="Driver Name" value={pass.driverName} />
                 </>
               )}

               {pass.passType === 'Material' && (
                 <>
                   <DetailItem label="Material Description" value={pass.materialDescription} />
                   <DetailItem label="Quantity" value={pass.quantity} />
                   <DetailItem label="Driver Name" value={pass.driverName} />
                   <DetailItem label="Vehicle Number" value={pass.vehicleNumber} />
                 </>
               )}

               <div className="col-span-1 md:col-span-2">
                 <DetailItem label="Purpose" value={pass.purpose} />
               </div>
               
               {pass.remarks && (
                 <div className="col-span-1 md:col-span-2">
                   <DetailItem label="Remarks" value={pass.remarks} />
                 </div>
               )}
            </div>

            {pass.attachments && pass.attachments.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[var(--border-light)]">
                 <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3 flex items-center gap-2">
                   <Paperclip size={16} /> Attachments ({pass.attachments.length})
                 </h3>
                 <div className="flex flex-wrap gap-3">
                   {pass.attachments.map(att => (
                     <div key={att.id} className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-md text-sm text-[var(--text-main)]">
                       <Paperclip size={14} className="text-[#0a6ed1]" />
                       <span>{att.name}</span>
                       <span className="text-xs text-[var(--text-muted)] ml-2">{(att.size / 1024).toFixed(1)} KB</span>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>

          {pass.status === 'Approved' && (
            <div className="bg-[var(--bg-card)] p-6 shadow-sm border-t-2 border-t-green-500 rounded-lg flex gap-6 items-center">
               <div className="bg-white p-2 rounded-lg shrink-0">
                  <QRCode value={JSON.stringify({ id: pass.id, type: pass.passType, name: pass.visitorName || pass.vehicleNumber || 'Material Pass' })} size={120} />
               </div>
               <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--text-main)] mb-2">
                    <QrCode size={20} /> Gate Pass Ready
                  </h2>
                  <p className="text-[var(--text-muted)] text-sm mb-4">Please present this QR code at the security gate for scanning. Code is valid only during the designated entry and exit times.</p>
                  <button className="px-4 py-2 bg-[var(--bg-main)] text-[#0a6ed1] font-semibold border border-[var(--border-light)] rounded text-sm hover:bg-[var(--border-light)] transition-colors">
                     Download PDF
                  </button>
               </div>
            </div>
          )}

          {canApprove() && (
             <div className="bg-[var(--bg-card)] p-6 shadow-sm border-t-2 border-t-[#f58b00] rounded-lg">
               <h2 className="text-lg font-semibold flex items-center gap-2 text-[var(--text-main)] mb-4">
                 <MessageSquare size={18} /> Review Comments
               </h2>
               <textarea 
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full border border-[var(--border-light)] rounded p-3 text-sm focus:border-[#0a6ed1] outline-none min-h-[100px] bg-[var(--bg-main)] text-[var(--text-main)]"
                  placeholder="Enter remarks for approval or rejection (optional)"
               />
             </div>
          )}

        </div>

        {/* Timeline / History */}
        <div className="w-full lg:w-80 bg-[var(--bg-card)] p-6 shadow-sm border border-[var(--border-light)] rounded-lg">
           <h2 className="text-lg font-semibold text-[var(--text-main)] mb-6 flex items-center gap-2">
             <Clock size={18} /> Approval Timeline
           </h2>
           <div className="relative border-l-2 border-[var(--border-light)] ml-3">
             {pass.approvalHistory.map((event, index) => (
               <div key={event.id} className="mb-8 ml-6 relative">
                 <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-[#0a6ed1] border-4 border-[var(--bg-card)]"></div>
                 <div className="text-sm font-semibold text-[var(--text-main)]">{event.role} - {event.user}</div>
                 <div className="text-xs text-[var(--text-muted)] mb-1">{format(new Date(event.date), 'PPp')}</div>
                 <div className="inline-block px-2 py-1 bg-[var(--bg-main)] text-[var(--text-muted)] text-xs rounded mt-1 font-medium border border-[var(--border-light)]">
                   Action: {event.action}
                 </div>
                 {event.comments && (
                   <div className="mt-2 text-sm text-[var(--text-main)] bg-[var(--bg-main)] p-2 rounded border border-[var(--border-light)] shadow-sm">
                     "{event.comments}"
                   </div>
                 )}
               </div>
             ))}
             
             {/* Pending indicator */}
             {pass.status !== 'Approved' && pass.status !== 'Rejected' && pass.status !== 'Closed' && (
                <div className="mb-2 ml-6 relative">
                  <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-orange-400 border-4 border-[var(--bg-card)] animate-pulse"></div>
                  <div className="text-sm font-semibold text-[var(--text-muted)] italic">Pending Next Action</div>
                </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value: any }) {
  return (
    <div>
      <div className="text-sm text-[var(--text-muted)] mb-1">{label}</div>
      <div className="text-[var(--text-main)] font-medium break-words">{value || '-'}</div>
    </div>
  )
}
