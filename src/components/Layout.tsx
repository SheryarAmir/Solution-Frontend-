import React from 'react';
import { CollapsibleSidebar } from '../SideBar/siderbar';
import ROSHeader from './Ros-Header';
import { SidebarProvider } from '../components/ui/sidebar';

const Layout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 w-full">
        <ROSHeader/>
        <CollapsibleSidebar />
      </div>
    </SidebarProvider>
  );
};

export default Layout; 