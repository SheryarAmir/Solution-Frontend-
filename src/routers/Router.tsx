// src/routes/Router.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "../Auth/components/SignIn";
import SignUp from "../Auth/components/SignUp";
import Register from "../Auth/components/register";
import Dashboard from "../components/Dashboard/DashBord";
import Layout from "../components/Layout";
import Debug from "../components/Debug";

// Cash Management Components
import NewCashUp from "../CashManagmentModules/NewCashUp/newcashup";
import ViewCashup from "../CashManagmentModules/Viewcashup/viewcashup";
import ViewReport from "../CashManagmentModules/ViewReport/viewreport";
import AllCashUp from "../CashManagmentModules/CashManagmentModules/AllCashUp/allcashup";
import AllReport from "../CashManagmentModules/CashManagmentModules/AllReport/allreport";
import CashUpSummary from "../CashManagmentModules/CashupSummary/cashupsummary";

// Employee Management Components
import AllEmployees from "../EmployeeModules/AllEmployes/allemployes";
import ShiftCalendarLanding from "../EmployeeModules/ShiftCalendarLanding/shiftcalendarlanding";
import Attendance from "../EmployeeModules/Attendance/Attendance";
import Request from "../EmployeeModules/Request/request";
import Leaves from "../EmployeeModules/Leaves/leaves";
import EmpProfile from "../EmployeeModules/EmpProfile/empprofile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      <Route path="/test" element={<div className="p-8 text-center">Test Route Working!</div>} />
      <Route path="/debug" element={<Debug />} />

      {/* Protected Routes with Layout */}
      <Route path="/" element={<Layout />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Accounting Routes */}
        <Route path="/accounting/cashup" element={<AllCashUp />} />
        <Route path="/accounting/cashup/deposit" element={<NewCashUp />} />
        <Route path="/accounting/reconciliation/home" element={<AllReport />} />
        <Route path="/accounting/report/home" element={<AllReport />} />
        <Route path="/accounting/safesummary" element={<CashUpSummary />} />

        {/* Integration Routes */}
        <Route path="/integration" element={<Dashboard />} />

        {/* Employee Management Routes */}
        <Route path="/emp-management/employees/all-employee" element={<AllEmployees />} />
        <Route path="/emp-management/shift-calendar/landing" element={<ShiftCalendarLanding />} />
        <Route path="/emp-management/attendance" element={<Attendance />} />
        <Route path="/emp-management/approvals" element={<Request />} />
        <Route path="/emp-management/leaves" element={<Leaves />} />
        <Route path="/emp-management/user-mapping" element={<Dashboard />} />
        <Route path="/emp-management/payroll/all-payroll" element={<Dashboard />} />
        <Route path="/emp-management/profile" element={<EmpProfile />} />

        {/* Legacy Routes - Keep for backward compatibility */}
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/NewCashUp" element={<NewCashUp />} />
        <Route path="/ViewCashup" element={<ViewCashup />} />
        <Route path="/ViewReport" element={<ViewReport />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
};

export default AppRoutes;

