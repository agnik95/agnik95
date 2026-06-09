import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GatePass, UserRole, GatePassStatus } from './types';

// Mock initial data
const initialPasses: GatePass[] = [
  {
    id: 'GP-10001',
    requestDate: '2023-10-24T08:00',
    employeeId: 'EMP-1042',
    employeeName: 'John Doe',
    department: 'Production',
    passType: 'Visitor',
    visitorName: 'Alice Smith',
    visitorCompany: 'Tech Corp',
    purpose: 'System Maintenance',
    entryDateTime: '2023-10-25T09:00',
    exitDateTime: '2023-10-25T17:00',
    status: 'Approved',
    approvalHistory: [
      { id: '1', role: 'Employee', action: 'Submitted', date: '2023-10-24T08:05', user: 'John Doe' },
      { id: '2', role: 'Approver', action: 'Approved', date: '2023-10-24T10:15', user: 'Jane Manager', comments: 'Looks good' },
      { id: '3', role: 'Security', action: 'Approved', date: '2023-10-24T14:20', user: 'Bob Guard' }
    ]
  },
  {
    id: 'GP-10002',
    requestDate: '2023-10-26T10:00',
    employeeId: 'EMP-1042',
    employeeName: 'John Doe',
    department: 'Logistics',
    passType: 'Material',
    materialDescription: 'Laptops for recycling',
    quantity: 15,
    vehicleNumber: 'KA-01-AB-1234',
    driverName: 'Mike Johnson',
    purpose: 'E-Waste Disposal',
    entryDateTime: '2023-10-27T10:00',
    exitDateTime: '2023-10-27T12:00',
    status: 'Manager Approval',
    approvalHistory: [
      { id: '1', role: 'Employee', action: 'Submitted', date: '2023-10-26T10:05', user: 'John Doe' }
    ]
  },
  {
    id: 'GP-10003',
    requestDate: '2023-10-26T14:00',
    employeeId: 'EMP-2091',
    employeeName: 'Sarah Connor',
    department: 'Engineering',
    passType: 'Vehicle',
    vehicleNumber: 'MH-12-CD-5678',
    driverName: 'Tom Hardy',
    purpose: 'Equipment Delivery',
    entryDateTime: '2023-10-28T08:00',
    exitDateTime: '2023-10-28T18:00',
    status: 'Security Approval',
    approvalHistory: [
      { id: '1', role: 'Employee', action: 'Submitted', date: '2023-10-26T14:05', user: 'Sarah Connor' },
      { id: '2', role: 'Approver', action: 'Approved', date: '2023-10-26T15:30', user: 'Jane Manager' }
    ]
  }
];

interface AppState {
  currentView: string;
  navigate: (view: string, params?: any) => void;
  viewParams: any;
  role: UserRole;
  setRole: (role: UserRole) => void;
  gatePasses: GatePass[];
  addGatePass: (pass: GatePass) => void;
  updateGatePassStatus: (id: string, status: GatePassStatus, comments: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notifications: any[];
  addNotification: (message: string, gatePassId?: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState('launchpad');
  const [viewParams, setViewParams] = useState<any>(null);
  const [role, setRole] = useState<UserRole>('Employee');
  const [gatePasses, setGatePasses] = useState<GatePass[]>(initialPasses);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState<any[]>([]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  const addNotification = (message: string, gatePassId?: string) => {
    setNotifications(prev => [{ id: Date.now().toString(), message, date: new Date().toISOString(), read: false, gatePassId }, ...prev]);
  };

  const clearNotifications = () => setNotifications([]);

  const navigate = (view: string, params?: any) => {
    setCurrentView(view);
    setViewParams(params || null);
  };

  const addGatePass = (pass: GatePass) => {
    setGatePasses(prev => [pass, ...prev]);
    addNotification(`New Gate Pass ${pass.id} created successfully.`, pass.id);
  };

  const updateGatePassStatus = (id: string, status: GatePassStatus, comments: string) => {
    setGatePasses(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          approvalHistory: [
            ...p.approvalHistory,
            {
              id: Date.now().toString(),
              role,
              action: status,
              date: new Date().toISOString(),
              comments,
              user: role === 'Admin' ? 'System Admin' : 'Current User'
            }
          ]
        };
      }
      return p;
    }));
    addNotification(`Gate Pass ${id} status updated to ${status}.`, id);
  }

  return (
    <AppContext.Provider value={{
      currentView, navigate, viewParams, role, setRole, gatePasses, addGatePass, updateGatePassStatus,
      theme, toggleTheme, notifications, addNotification, clearNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
