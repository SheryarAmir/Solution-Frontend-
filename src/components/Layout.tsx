import React from 'react';
import { CollapsibleSidebar } from '../SideBar/siderbar';
import ROSHeader from './Ros-Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ROSHeader/>
      <CollapsibleSidebar />
    </div>
  );
};

export default Layout; 