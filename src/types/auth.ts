export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
}

export type UserRole = 'admin' | 'manager' | 'employee' | 'accountant' | 'hr';

export const UserRole = {
  ADMIN: 'admin' as const,
  MANAGER: 'manager' as const,
  EMPLOYEE: 'employee' as const,
  ACCOUNTANT: 'accountant' as const,
  HR: 'hr' as const
} as const;

export type Permission = 
  // Accounting permissions
  | 'view_cashup'
  | 'create_cashup'
  | 'edit_cashup'
  | 'delete_cashup'
  | 'view_deposit'
  | 'create_deposit'
  | 'view_reconciliation'
  | 'create_reconciliation'
  | 'view_reports'
  | 'create_reports'
  | 'view_safe_summary'
  
  // Integration permissions
  | 'view_integration'
  | 'manage_integration'
  
  // Employee management permissions
  | 'view_employees'
  | 'create_employee'
  | 'edit_employee'
  | 'delete_employee'
  | 'view_shift_calendar'
  | 'manage_shift_calendar'
  | 'view_attendance'
  | 'manage_attendance'
  | 'view_approvals'
  | 'manage_approvals'
  | 'view_leaves'
  | 'manage_leaves'
  | 'view_user_mapping'
  | 'manage_user_mapping'
  | 'view_payroll'
  | 'manage_payroll'
  | 'view_profile'
  | 'edit_profile';

export const Permission = {
  // Accounting permissions
  VIEW_CASHUP: 'view_cashup' as const,
  CREATE_CASHUP: 'create_cashup' as const,
  EDIT_CASHUP: 'edit_cashup' as const,
  DELETE_CASHUP: 'delete_cashup' as const,
  VIEW_DEPOSIT: 'view_deposit' as const,
  CREATE_DEPOSIT: 'create_deposit' as const,
  VIEW_RECONCILIATION: 'view_reconciliation' as const,
  CREATE_RECONCILIATION: 'create_reconciliation' as const,
  VIEW_REPORTS: 'view_reports' as const,
  CREATE_REPORTS: 'create_reports' as const,
  VIEW_SAFE_SUMMARY: 'view_safe_summary' as const,
  
  // Integration permissions
  VIEW_INTEGRATION: 'view_integration' as const,
  MANAGE_INTEGRATION: 'manage_integration' as const,
  
  // Employee management permissions
  VIEW_EMPLOYEES: 'view_employees' as const,
  CREATE_EMPLOYEE: 'create_employee' as const,
  EDIT_EMPLOYEE: 'edit_employee' as const,
  DELETE_EMPLOYEE: 'delete_employee' as const,
  VIEW_SHIFT_CALENDAR: 'view_shift_calendar' as const,
  MANAGE_SHIFT_CALENDAR: 'manage_shift_calendar' as const,
  VIEW_ATTENDANCE: 'view_attendance' as const,
  MANAGE_ATTENDANCE: 'manage_attendance' as const,
  VIEW_APPROVALS: 'view_approvals' as const,
  MANAGE_APPROVALS: 'manage_approvals' as const,
  VIEW_LEAVES: 'view_leaves' as const,
  MANAGE_LEAVES: 'manage_leaves' as const,
  VIEW_USER_MAPPING: 'view_user_mapping' as const,
  MANAGE_USER_MAPPING: 'manage_user_mapping' as const,
  VIEW_PAYROLL: 'view_payroll' as const,
  MANAGE_PAYROLL: 'manage_payroll' as const,
  VIEW_PROFILE: 'view_profile' as const,
  EDIT_PROFILE: 'edit_profile' as const
} as const;

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
} 