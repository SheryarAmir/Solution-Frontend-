import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout, hasPermission } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">Solution Frontend</div>
          
          <div className="flex space-x-4">
            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            
            {/* Accounting Links */}
            {hasPermission('view_cashup') && (
              <div className="relative group">
                <span className="cursor-pointer hover:text-gray-300">Accounting</span>
                <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/accounting/cashup" className="block px-4 py-2 hover:bg-gray-100">Cash Up</Link>
                  {hasPermission('view_deposit') && (
                    <Link to="/accounting/cashup/deposit" className="block px-4 py-2 hover:bg-gray-100">Deposit</Link>
                  )}
                  {hasPermission('view_reconciliation') && (
                    <Link to="/accounting/reconciliation/home" className="block px-4 py-2 hover:bg-gray-100">Reconciliation</Link>
                  )}
                  {hasPermission('view_reports') && (
                    <Link to="/accounting/report/home" className="block px-4 py-2 hover:bg-gray-100">Reports</Link>
                  )}
                  {hasPermission('view_safe_summary') && (
                    <Link to="/accounting/safesummary" className="block px-4 py-2 hover:bg-gray-100">Safe Summary</Link>
                  )}
                </div>
              </div>
            )}
            
            {/* Integration Link */}
            {hasPermission('view_integration') && (
              <Link to="/integration" className="hover:text-gray-300">Integration</Link>
            )}
            
            {/* Employee Management Links */}
            {hasPermission('view_employees') && (
              <div className="relative group">
                <span className="cursor-pointer hover:text-gray-300">Employee Management</span>
                <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/emp-management/employees/all-employee" className="block px-4 py-2 hover:bg-gray-100">All Employees</Link>
                  {hasPermission('view_shift_calendar') && (
                    <Link to="/emp-management/shift-calendar/landing" className="block px-4 py-2 hover:bg-gray-100">Shift Calendar</Link>
                  )}
                  {hasPermission('view_attendance') && (
                    <Link to="/emp-management/attendance" className="block px-4 py-2 hover:bg-gray-100">Attendance</Link>
                  )}
                  {hasPermission('view_approvals') && (
                    <Link to="/emp-management/approvals" className="block px-4 py-2 hover:bg-gray-100">Approvals</Link>
                  )}
                  {hasPermission('view_leaves') && (
                    <Link to="/emp-management/leaves" className="block px-4 py-2 hover:bg-gray-100">Leaves</Link>
                  )}
                  {hasPermission('view_user_mapping') && (
                    <Link to="/emp-management/user-mapping" className="block px-4 py-2 hover:bg-gray-100">User Mapping</Link>
                  )}
                  {hasPermission('view_payroll') && (
                    <Link to="/emp-management/payroll/all-payroll" className="block px-4 py-2 hover:bg-gray-100">Payroll</Link>
                  )}
                </div>
              </div>
            )}
            
            {/* Profile Link */}
            {hasPermission('view_profile') && (
              <Link to="/emp-management/profile" className="hover:text-gray-300">Profile</Link>
            )}
            
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <span className="text-sm">Welcome, {user.name}</span>
              <button 
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 