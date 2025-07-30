import React from 'react';
import { CollapsibleSidebar } from '../SideBar/siderbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CollapsibleSidebar />
    </div>
  );
};

export default Layout; 