export type GatePassStatus = 'Draft' | 'Submitted' | 'Manager Approval' | 'Security Approval' | 'Approved' | 'Rejected' | 'Closed';
export type PassType = 'Visitor' | 'Vehicle' | 'Material';
export type UserRole = 'Employee' | 'Approver' | 'Security' | 'Admin';

export interface ApprovalTimelineEvent {
  id: string;
  role: string;
  action: string;
  date: string;
  comments?: string;
  user: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  gatePassId?: string;
}

export interface GatePass {
  id: string; // Auto Generated ZGATEPASS_HDR
  requestDate: string;
  employeeId: string;
  employeeName: string;
  department: string;
  
  passType: PassType;
  
  // Visitor Details
  visitorName?: string;
  visitorCompany?: string;
  
  // Vehicle Details
  vehicleNumber?: string;
  driverName?: string;
  
  // Material Details
  materialDescription?: string;
  quantity?: number;
  
  purpose: string;
  entryDateTime: string;
  exitDateTime: string;
  remarks?: string;
  
  attachments?: Attachment[];
  
  status: GatePassStatus;
  approvalHistory: ApprovalTimelineEvent[];
}

export const CURRENT_USER = {
  id: 'EMP-1042',
  name: 'John Doe',
  department: 'Production',
};
