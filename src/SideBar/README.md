# React Sidebar Component

This is a React conversion of the Angular sidebar component, using Bootstrap classes for styling.

## Features

- Collapsible sidebar with smooth animations
- Search functionality for menu items
- Responsive design
- Click outside to collapse
- Route-based active states
- FontAwesome icons support
- Bootstrap-compatible styling

## Usage

### Basic Usage

```tsx
import React, { useState } from 'react';
import { Sidebar } from './SideBar';

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);

  const handleCollapsedChange = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
  };

  return (
    <div className="d-flex">
      <Sidebar 
        collapsed={collapsed}
        onCollapsedChange={handleCollapsedChange}
      />
      <div 
        className="flex-grow-1"
        style={{ 
          marginLeft: collapsed ? '80px' : '235px',
          transition: 'margin-left 0.2s ease-in-out'
        }}
      >
        {/* Your main content here */}
      </div>
    </div>
  );
};
```

### Props

- `collapsed?: boolean` - Controls whether the sidebar is collapsed (default: true)
- `onCollapsedChange?: (collapsed: boolean) => void` - Callback when collapse state changes

### Customizing Menu Items

Edit `sidebar.model.ts` to customize the menu structure:

```tsx
export const SIDEBAR_MENU_ITEMS: Sidebar[] = [
  {
    name: "Settings",
    pages: "pages5",
    link: "/settings",
    icon: "icon-setting icon",
    children: [
      {
        name: "Account",
        link: "/account",
        icon: "icon-integration icon",
      },
      // Add more menu items...
    ]
  },
];
```

### Styling

The component uses Bootstrap classes and custom CSS. You can override styles by modifying `sidebar.css`.

### Icons

The component supports:
- FontAwesome icons (via @fortawesome/react-fontawesome)
- Custom SVG icons
- CSS background images for icons

### Dependencies

- React Router DOM (for navigation)
- FontAwesome (for icons)
- Bootstrap (for styling classes)

## Key Differences from Angular Version

1. **State Management**: Uses React hooks instead of Angular services
2. **Event Handling**: Uses React event handlers instead of Angular's HostListener
3. **Routing**: Uses React Router instead of Angular Router
4. **Styling**: Uses Bootstrap classes instead of Angular's ngClass
5. **Icons**: Uses FontAwesome React components instead of Angular's icon directives

## File Structure

```
src/SideBar/
├── Sidebar.tsx          # Main component
├── sidebar.model.ts     # Types and menu data
├── sidebar.css          # Styles
├── index.ts             # Exports
├── SidebarExample.tsx   # Usage example
└── README.md           # Documentation
``` 