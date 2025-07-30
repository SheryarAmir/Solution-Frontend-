import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_MENU_ITEMS } from './sidebar.model';
import { useAuth } from '../../pas/auth/hooks/useAuth';

interface SidebarItem {
  name: string;
  link?: string;
  icon?: string;
  pages: string;
  children: SidebarChildItem[];
}

interface SidebarChildItem {
  name: string;
  link: string;
  icon?: string;
}

const Sidebar: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [showMenu, setShowMenu] = useState<string[]>([]);
  const [isShowFilter, setIsShowFilter] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>(SIDEBAR_MENU_ITEMS);
  const [originalSidebarItems, setOriginalSidebarItems] = useState<SidebarItem[]>([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    setOriginalSidebarItems(JSON.parse(JSON.stringify(SIDEBAR_MENU_ITEMS)));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992 && isActive) {
        toggleSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (isShowFilter) {
          setCollapsed(true);
          // You might need to emit this change to parent if needed
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isShowFilter]);

  const toggleFilter = () => {
    setIsShowFilter(!isShowFilter);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    // You might need to emit this change to parent if needed
  };

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  const addExpandClass = (page: string) => {
    setShowMenu(prev => 
      prev.includes(page) 
        ? prev.filter(p => p !== page)
        : [...prev, page]
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (value !== "") {
      const newSidebar = originalSidebarItems.map(item => {
        const filteredChildren = item.children.filter(child => 
          child.name.toLowerCase().includes(value.toLowerCase())
        );
        
        return {
          ...item,
          children: filteredChildren
        };
      }).filter(item => item.children.length > 0);

      // Add to showMenu if not already there
      const pagesToShow = newSidebar
        .filter(item => item.children.length > 0 && !showMenu.includes(item.pages))
        .map(item => item.pages);
      
      if (pagesToShow.length > 0) {
        setShowMenu(prev => [...prev, ...pagesToShow]);
      }

      setSidebarItems(newSidebar);
    } else {
      setSidebarItems(originalSidebarItems);
    }
  };

  const goToBanking = () => {
    navigate('/accounting/cashup/deposit', { state: { viewState: 'DEPOSITS' } });
  };

  const setActiveCard = () => {
    localStorage.setItem('activeCard', 'Client');
  };

  return (
    <div 
      ref={sidebarRef}
      className={`bg-white h-full overflow-y-auto overflow-x-hidden transition-all duration-200 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      } ${isActive ? 'sidebarPushRight' : ''}`}
    >
      <div className="flex flex-col">
        <div className="flex justify-between p-4">
          {isShowFilter && (
            <button 
              onClick={toggleCollapsed}
              className="p-4 cursor-pointer text-black hover:bg-gray-100 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 27 19"
              >
                <g transform="translate(1.5 1.5)">
                  <path
                    d="M4.5,18h24"
                    transform="translate(-4.5 -10)"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                  <path
                    d="M4.5,9h24"
                    transform="translate(-4.5 -9)"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                  <path
                    d="M4.5,27h24"
                    transform="translate(-4.5 -11)"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                </g>
              </svg>
            </button>
          )}
          
          {isShowFilter && (
            <button onClick={toggleFilter} className="mt-6 pr-4">
              <i className="fa fa-search fa-lg" aria-hidden="true"></i>
            </button>
          )}
          
          {!isShowFilter && (
            <div className="mt-4 ml-4 flex items-center">
              <input
                type="text"
                placeholder="Search"
                className="font-medium h-14"
                value={searchText}
                onChange={handleSearch}
              />
              <button onClick={toggleFilter} className="ml-2">
                <i className="fa fa-times fa-lg" aria-hidden="true"></i>
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {sidebarItems.map((item) => (
            <div key={item.pages} className="nested-menu">
              <button
                onClick={() => addExpandClass(item.pages)}
                className="w-full text-left p-4 hover:bg-gray-100 flex items-center"
              >
                {item.name !== 'Integration' && (
                  <div className={item.icon}></div>
                )}
                
                {item.name === 'Settings' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
                    <path
                      d="M16.625,6.5,18,3.875l-1.75-1.75L13.625,3.5A4.478,4.478,0,0,0,12.25,3l-1-3H8.75l-1,2.875a5.224,5.224,0,0,0-1.25.5L3.875,2,2,3.875,3.375,6.5a5.224,5.224,0,0,0-.5,1.25L0,8.75v2.5l2.875,1c.125.5.375.875.5,1.375L2,16.25,3.75,18l2.625-1.375a4.478,4.478,0,0,0,1.375.5L8.75,20h2.5l1-2.875c.5-.125.875-.375,1.375-.5L16.25,18,18,16.25l-1.375-2.625a4.478,4.478,0,0,0,.5-1.375l2.875-1V8.75l-2.875-1A5.224,5.224,0,0,0,16.625,6.5ZM10,13.75A3.683,3.683,0,0,1,6.25,10,3.683,3.683,0,0,1,10,6.25,3.683,3.683,0,0,1,13.75,10,3.683,3.683,0,0,1,10,13.75Z"
                    />
                  </svg>
                )}
                
                {!collapsed && (
                  <>
                    <span className="ml-1">{item.name}</span>
                    {item.name !== 'Integration' && (
                      <i className="fa fa-caret-down ml-auto" aria-hidden="true"></i>
                    )}
                  </>
                )}
              </button>

              <div className={`${showMenu.includes(item.pages) ? 'block' : 'hidden'}`}>
                <ul className="pl-4">
                  {item.children.map((child) => (
                    <li key={child.name} className="mt-2">
                      {user?.role?.name !== 'ROLE_CLIENTADMIN' && (
                        <button
                          onClick={() => {
                            setCollapsed(true);
                            setActiveCard();
                            if (child.link) {
                              navigate(child.link);
                            }
                          }}
                          className={`w-full text-left p-2 hover:bg-gray-100 flex items-center ${
                            location.pathname === child.link ? 'bg-yellow-500 text-white' : ''
                          }`}
                        >
                          {child.name === 'Subscription' && (
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="20" 
                              height="20" 
                              fill="currentColor" 
                              viewBox="0 0 16 16"
                            >
                              <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
                              <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                            </svg>
                          )}
                          
                          {child.name === 'Account' && (
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              fill="currentColor" 
                              viewBox="0 0 16 16"
                            >
                              <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                              <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                          )}
                          
                          {!collapsed && (
                            <span className="ml-5">{child.name}</span>
                          )}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;