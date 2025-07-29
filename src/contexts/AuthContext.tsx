import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data - replace with actual API calls
const mockUsers: Record<string, User> = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    permissions: [
      'view_cashup', 'create_cashup', 'edit_cashup', 'delete_cashup',
      'view_deposit', 'create_deposit', 'view_reconciliation', 'create_reconciliation',
      'view_reports', 'create_reports', 'view_safe_summary',
      'view_integration', 'manage_integration',
      'view_employees', 'create_employee', 'edit_employee', 'delete_employee',
      'view_shift_calendar', 'manage_shift_calendar', 'view_attendance', 'manage_attendance',
      'view_approvals', 'manage_approvals', 'view_leaves', 'manage_leaves',
      'view_user_mapping', 'manage_user_mapping', 'view_payroll', 'manage_payroll',
      'view_profile', 'edit_profile'
    ]
  },
  'accountant@example.com': {
    id: '2',
    email: 'accountant@example.com',
    name: 'Accountant User',
    role: 'accountant',
    permissions: [
      'view_cashup', 'create_cashup', 'edit_cashup',
      'view_deposit', 'create_deposit', 'view_reconciliation', 'create_reconciliation',
      'view_reports', 'create_reports', 'view_safe_summary',
      'view_integration',
      'view_profile', 'edit_profile'
    ]
  },
  'hr@example.com': {
    id: '3',
    email: 'hr@example.com',
    name: 'HR User',
    role: 'hr',
    permissions: [
      'view_employees', 'create_employee', 'edit_employee',
      'view_shift_calendar', 'manage_shift_calendar', 'view_attendance', 'manage_attendance',
      'view_approvals', 'manage_approvals', 'view_leaves', 'manage_leaves',
      'view_user_mapping', 'manage_user_mapping', 'view_payroll', 'manage_payroll',
      'view_profile', 'edit_profile'
    ]
  },
  'employee@example.com': {
    id: '4',
    email: 'employee@example.com',
    name: 'Employee User',
    role: 'employee',
    permissions: [
      'view_attendance', 'view_leaves', 'view_profile', 'edit_profile'
    ]
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    if (mockUsers[email]) {
      const user = mockUsers[email];
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 