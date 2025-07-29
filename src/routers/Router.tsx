// src/routes/Router.tsx
import { Routes, Route } from 'react-router-dom';
// import Home from '../pages/Home';
// import About from '../pages/About';
import SignIn from '../Auth/components/SignIn';
import SignUp from '../Auth/components/SignUp';
import Register from '../Auth/components/register';
import Dashboard from '../components/Dashboard/DashBord';
import NewCashUp from "..NewCashUp/newcashup"
import CashUp from "../components/AllCashUp/CashUp/cashup"
import ViewCashup from '../components/Viewcashup/viewcashup';
import ViewReport from '../components/ViewReport/viewreport';
// editreoprt
//newreport
//allcashup
//allreports
//CashUpActons
const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} /> */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
         <Route path="/Register" element={<Register />} />
           <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/NewCashUp" element={<NewCashUp />} />
                       <Route path="/CashUp" element={<CashUp />} />
                        <Route path="/ViewCashup" element={<ViewCashup />} />
                        <Route path="/ViewReport" element={<ViewReport/>} />
    </Routes>
  );
};

export default AppRoutes;
