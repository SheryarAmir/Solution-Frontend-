// src/routes/Router.tsx
import { Routes, Route, Navigate } from "react-router-dom";
// import Home from '../pages/Home';
// import About from '../pages/About';
import SignIn from "../Auth/components/SignIn";
import Register from "../Auth/components/register";
import Dashboard from "../components/Dashboard/DashBord";
import NewCashUp from "../CashManagmentModules/NewCashUp/newcashup";
// import CashUp from "../components/AllCashUp/CashUp/cashup";
import ViewCashup from "../CashManagmentModules/Viewcashup/viewcashup";
import ViewReport from "../CashManagmentModules/ViewReport/viewreport";
import EditReport from "../CashManagmentModules/EditReport/editreport";
import NewReport from "../CashManagmentModules/NewReoprt/newreoprt";
import AllCashUp from "../CashManagmentModules/AllCashUp/allcashup";
import AllReports from "../CashManagmentModules/AllReport/allreport";
import CashUpActions from "../CashManagmentModules/CashUpActions/cashupactions";
const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} /> */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/NewCashUp" element={<NewCashUp />} />
      {/* <Route path="/CashUp" element={<CashUp />} /> */}
      <Route path="/ViewCashup" element={<ViewCashup />} />
      <Route path="/ViewReport" element={<ViewReport />} />
      <Route path="/EditReport" element={<EditReport />} />
      <Route path="/NewReport" element={<NewReport />} />
      <Route path="/AllCashUp" element={<AllCashUp />} />
      <Route path="/AllReports" element={<AllReports />} />
      <Route path="/CashUpActions" element={<CashUpActions data={{}} context={{ componentParent: { editCashup: () => {}, viewCashup: () => {}, deleteCashup: () => {} } }} />} />
    </Routes>
  );
};

export default AppRoutes;

