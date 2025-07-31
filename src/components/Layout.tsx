import React from 'react';
import { Outlet } from 'react-router-dom';
// import Header from './common/Header/Header';
import SidebarComponent from '../SideBar/Sidebar';
import ROSHeader from './Ros-Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ROSHeader />
      <div className="flex">
        <SidebarComponent />
        <main className="flex max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" style={{ marginTop: '4.5rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 