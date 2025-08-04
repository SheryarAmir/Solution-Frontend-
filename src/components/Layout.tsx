import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
// import Header from './common/Header/Header';
import SidebarComponent from '../SideBar/Sidebar';
import ROSHeader from './Ros-Header';

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const sidebarWidth = sidebarCollapsed ? 80 : 235;

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="flex flex-col">
        <ROSHeader />
      </div>
      <div className="flex flex-col">
        <SidebarComponent 
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
        <main 
          className="flex-1 py-6 px-4" 
          style={{ 
            marginTop: '4.5rem',
            marginLeft: `${sidebarWidth}px`,
            width: `calc(100% - ${sidebarWidth}px)`
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 