import React, { useState, useRef } from 'react';
import { useAppContext } from '../store';
import { GatePass, PassType, CURRENT_USER, Attachment } from '../types';
import { Paperclip, X } from 'lucide-react';

export function CreateGatePass() {
  const { navigate, addGatePass } = useAppContext();
  const [passType, setPassType] = useState<PassType>('Visitor');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    requesterName: '',
    department: '',
    visitorName: '',
    visitorCompany: '',
    vehicleNumber: '',
    driverName: '',
    materialDescription: '',
    quantity: '',
    purpose: '',
    entryDate: '',
    entryTime: '',
    exitDate: '',
    exitTime: '',
    remarks: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const id = `GP-${Math.floor(10000 + Math.random() * 90000)}`; // Simple auto-gen
    const now = new Date().toISOString();

    const formattedAttachments: Attachment[] = attachments.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      size: file.size
    }));

    const newPass: GatePass = {
      id,
      requestDate: now,
      employeeId: CURRENT_USER.id,
      employeeName: formData.requesterName,
      department: formData.department,
      passType,
      visitorName: formData.visitorName,
      visitorCompany: formData.visitorCompany,
      vehicleNumber: formData.vehicleNumber,
      driverName: formData.driverName,
      materialDescription: formData.materialDescription,
      quantity: Number(formData.quantity) || undefined,
      purpose: formData.purpose,
      entryDateTime: `${formData.entryDate}T${formData.entryTime}`,
      exitDateTime: `${formData.exitDate}T${formData.exitTime}`,
      remarks: formData.remarks,
      attachments: formattedAttachments,
      status: 'Submitted',
      approvalHistory: [
        {
          id: Date.now().toString(),
          role: 'Employee',
          user: formData.requesterName,
          action: 'Submitted',
          date: now,
        }
      ]
    };

    addGatePass(newPass);
    navigate('objectPage', { id });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">Create Gate Pass</h1>
      </div>

      <div className="bg-[var(--bg-card)] shadow-sm border border-[var(--border-light)] flex-1 overflow-auto rounded-xl">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 max-w-4xl text-[var(--text-main)]">
          
          {/* Header Info */}
          <div className="bg-[var(--bg-main)] p-4 rounded mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 border border-[var(--border-light)]">
             <div>
               <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest mb-1">Requester ID</label>
               <div className="font-semibold text-[var(--text-main)] py-2.5">{CURRENT_USER.id}</div>
             </div>
             <div>
               <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest mb-1">Requester Name *</label>
               <input required name="requesterName" value={formData.requesterName} onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none text-sm placeholder-[var(--text-muted)] text-[var(--text-main)]" placeholder="e.g. John Doe" />
             </div>
             <div>
               <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest mb-1">Department *</label>
               <input required name="department" value={formData.department} onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none text-sm placeholder-[var(--text-muted)] text-[var(--text-main)]" placeholder="e.g. Production" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Information */}
            <div className="space-y-6 md:col-span-2 border-b border-[var(--border-light)] pb-8">
              <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4">Pass Classification</h3>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Pass Type *</label>
                <select 
                  className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] focus:ring-1 focus:ring-[#0a6ed1] outline-none text-[var(--text-main)]"
                  value={passType}
                  onChange={(e) => setPassType(e.target.value as PassType)}
                >
                  <option value="Visitor">Visitor Pass</option>
                  <option value="Vehicle">Vehicle Pass</option>
                  <option value="Material">Material Pass</option>
                </select>
              </div>
            </div>

            {/* Type Specific Fields */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4">{passType} Details</h3>
              
              {passType === 'Visitor' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Visitor Name *</label>
                    <input required name="visitorName" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Company / Organization *</label>
                    <input required name="visitorCompany" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none text-[var(--text-main)]" />
                  </div>
                </>
              )}

              {passType === 'Vehicle' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Vehicle Registration Number *</label>
                    <input required name="vehicleNumber" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Driver Name *</label>
                    <input required name="driverName" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none text-[var(--text-main)]" />
                  </div>
                </>
              )}

              {passType === 'Material' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Material Description *</label>
                    <textarea required name="materialDescription" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none resize-none text-[var(--text-main)]" rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font- medium text-[var(--text-muted)] mb-1">Quantity *</label>
                      <input required type="number" name="quantity" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none text-[var(--text-main)]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Vehicle Number & Driver (Optional)</label>
                    <input name="vehicleNumber" placeholder="Reg. No" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded mb-2 outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]" />
                    <input name="driverName" placeholder="Driver Name" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]" />
                  </div>
                </>
              )}
            </div>

            {/* Schedule & Logistics */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4">Schedule & Purpose</h3>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Purpose of Event *</label>
                <input required name="purpose" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none text-[var(--text-main)]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Expected Entry Date *</label>
                  <input required type="date" name="entryDate" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none text-[var(--text-main)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Time *</label>
                  <input required type="time" name="entryTime" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none text-[var(--text-main)]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Expected Exit Date *</label>
                  <input required type="date" name="exitDate" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none text-[var(--text-main)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Time *</label>
                  <input required type="time" name="exitTime" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none text-[var(--text-main)]" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-6 border-t border-[var(--border-light)]">
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Attachments</label>
              <div className="flex flex-col gap-2">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-[var(--border-light)] rounded text-sm text-[var(--text-muted)] hover:bg-[var(--bg-main)] hover:border-[#0a6ed1] transition-colors w-fit"
                >
                  <Paperclip size={16} /> Add Attachment
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  multiple 
                />
                
                {attachments.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-[var(--bg-main)] border border-[var(--border-light)] rounded text-sm max-w-md text-[var(--text-main)]">
                        <span className="truncate">{file.name}</span>
                        <button type="button" onClick={() => removeAttachment(index)} className="text-[#e52929] hover:opacity-80">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 pt-6 border-t border-[var(--border-light)]">
               <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Additional Remarks</label>
               <textarea name="remarks" onChange={handleChange} className="w-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded focus:border-[#0a6ed1] outline-none resize-none text-[var(--text-main)] placeholder-[var(--text-muted)]" rows={3} placeholder="Any specific instructions for security or approver..." />
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border-light)] flex justify-end gap-4">
            <button type="button" onClick={() => navigate('launchpad')} className="px-6 py-2.5 border border-[#0a6ed1] text-[#0a6ed1] font-semibold rounded hover:bg-blue-50 dark:hover:bg-[#0a6ed1]/10 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-[#0a6ed1] text-white font-semibold rounded hover:bg-[#085ab0] transition-colors">
               Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
