import React, { useState } from 'react';
import SidebarComponent from './Sidebar';
import Header from '../components/common/Header/Header';

const SidebarExample: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);

  const handleCollapsedChange = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    console.log('Sidebar collapsed:', newCollapsed);
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Fixed Header */}
      <Header />
      
      {/* Main content with sidebar */}
      <div className="d-flex flex-grow-1" style={{ marginTop: '56px' }}>
        <SidebarComponent 
          collapsed={collapsed}
          onCollapsedChange={handleCollapsedChange}
        />
        <div 
          className="flex-grow-1"
          style={{ 
            marginLeft: collapsed ? '80px' : '235px',
            transition: 'margin-left 0.2s ease-in-out',
            padding: '20px',
            minHeight: 'calc(100vh - 56px)'
          }}
        >
          <h1>Main Content Area</h1>
          <p>This is the main content that adjusts based on sidebar state.</p>
          <p>Sidebar is currently {collapsed ? 'collapsed' : 'expanded'}.</p>
          <p>The sidebar is now positioned below the fixed header on the left side.</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarExample; 