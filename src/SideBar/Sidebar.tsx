import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ChevronDown, Hexagon } from 'lucide-react';
import type { Sidebar } from './sidebar.model';

// Direct import of menu items to avoid any import issues
const SIDEBAR_MENU_ITEMS: Sidebar[] = [
  {
    name: "Cash Management",
    pages: "pages1",
    link: "accounting",
    icon: "icon-cashmanagement icon",
    children: [
      {
        name: "Cash Up",
        link: "/accounting/cashup",
        icon: "icon-cashup icon",
      },
      {
        name: "Deposit",
        link: "/accounting/cashup/deposit",
        icon: "icon-deposit icon",
      },
      {
        name: "Reconciliation",
        link: "/accounting/reconciliation/home",
        icon: "icon-reconciliation icon",
      },
      {
        name: "Reports",
        link: "/accounting/report/home",
        icon: "icon-report icon",
      },
      {
        name: "Safe Summary",
        link: "/accounting/safesummary",
        icon: "icon-report icon",
      },
    ],
  },
  {
    name: "Integration",
    pages: "pages4",
    link: "/integration",
    icon: "icon-integration icon",
    children: []
  },
  {
    name: "Employees",
    pages: "pages2",
    link: "",
    icon: "icon-employee icon",
    children: [
      {
        name: "Employees",
        link: "/emp-management/employees/all-employee",
        icon: "icon-team icon",
      },
      {
        name: "Shift Calendar",
        link: "/emp-management/shift-calendar/landing",
        icon: "icon-payroll icon",
      },
      {
        name: "Attendance",
        link: "/emp-management/attendance",
        icon: "icon-rota icon",
      },
      {
        name: "Requests",
        link: "/emp-management/approvals",
        icon: "icon-requests icon",
      },
      {
        name: "Leaves",
        link: "/emp-management/leaves",
        icon: "icon-leaves icon",
      },
      {
        name: "User Mapping",
        link: "/emp-management/user-mapping",
        icon: "icon-profile icon",
      },
      {
        name: "Payroll",
        link: "/emp-management/payroll/all-payroll",
        icon: "icon-report icon",
      },
      {
        name: "Profile",
        link: "/emp-management/profile",
        icon: "icon-profile icon",
      },
    ],
  },

];
import './sidebar.css';

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({ 
  collapsed = true, 
  onCollapsedChange 
}) => {
  const [isActive, setIsActive] = useState(true);
  const [collapsedState, setCollapsedState] = useState(collapsed);
  const [showMenu, setShowMenu] = useState<string[]>(['pages1']); // Auto-expand first item
  const [isshownfilter, setIsshownfilter] = useState(true);
  const [name, setName] = useState('');
  const [sidebar, setSidebar] = useState<Sidebar[]>(SIDEBAR_MENU_ITEMS);
  const [orgSidebar] = useState<Sidebar[]>(JSON.parse(JSON.stringify(SIDEBAR_MENU_ITEMS)));
  const [userDepartment, setUserDepartment] = useState<any>(null);

  // Debug: Log sidebar data
  console.log('Sidebar data:', sidebar);
  console.log('SIDEBAR_MENU_ITEMS:', SIDEBAR_MENU_ITEMS);
  console.log('SIDEBAR_MENU_ITEMS length:', SIDEBAR_MENU_ITEMS.length);
  console.log('SIDEBAR_MENU_ITEMS names:', SIDEBAR_MENU_ITEMS.map(item => item.name));
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle click outside to collapse sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (isshownfilter) {
          setCollapsedState(true);
          onCollapsedChange?.(true);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isshownfilter, onCollapsedChange]);

  // Handle route changes to collapse sidebar on mobile
  useEffect(() => {
    if (window.innerWidth <= 992 && isActive) {
      setCollapsedState(true);
      onCollapsedChange?.(true);
    }
  }, [location, isActive, onCollapsedChange]);

  const eventCalled = () => {
    setIsActive(!isActive);
  };

  const addExpandClass = (element: string) => {
    if (showMenu.indexOf(element) > -1) {
      setShowMenu(showMenu.filter(item => item !== element));
    } else {
      setShowMenu([...showMenu, element]);
    }
    // Mock user department - replace with actual auth context
    setUserDepartment({ role: { name: 'ROLE_ADMIN' } });
  };

  const togglefilter = () => {
    setIsshownfilter(!isshownfilter);
  };

  const collapseSidebar = (d: boolean) => {
    setCollapsedState(d);
    onCollapsedChange?.(d);
  };

  const toggleCollapsed = () => {
    const newCollapsed = !collapsedState;
    setCollapsedState(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setName(searchValue);
    
    if (searchValue !== "") {
      const newsidebar: Sidebar[] = [];
      orgSidebar.forEach((res) => {
        const sidebarElem: Sidebar = {
          name: res.name,
          link: res.link,
          icon: res.icon,
          pages: res.pages,
          children: [],
        };
        
        res.children.forEach((elem) => {
          if (elem.name.toLowerCase().includes(searchValue.toLowerCase())) {
            sidebarElem.children.push(elem);
          }
        });
        
        newsidebar.push(sidebarElem);

        if (sidebarElem.children.length > 0 && !showMenu.includes(sidebarElem.pages)) {
          setShowMenu(prev => [...prev, sidebarElem.pages]);
        }
      });
      setSidebar(newsidebar);
    } else {
      setSidebar(JSON.parse(JSON.stringify(orgSidebar)));
    }
  };

  const gotobanking = () => {
    navigate('/accounting/cashup/deposit', { 
      state: { viewState: "DEPOSITS" } 
    });
  };

  const setActiveCard = () => {
    localStorage.setItem("activeCard", 'Client');
  };

  return (
    <nav 
      ref={sidebarRef}
      className={`sidebar ${isActive ? 'sidebarPushRight' : ''} ${collapsedState ? 'collapsed' : ''}`}
      style={{
        marginTop: '0',
        paddingTop: '10px',
        borderRadius: '0',
        left: '0',
        width: collapsedState ? '80px' : '235px',
        marginBottom: '48px',
        height: 'calc(100vh - 56px)',
        overflow: 'auto',
        overflowY: 'auto',
        backgroundColor: '#fff',
        bottom: '0',
        overflowX: 'hidden',
        paddingBottom: '55px',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease-in-out',
        position: 'fixed',
        zIndex: 1000,
        // top: '56px',

      }}
    >
      <div className="list-group" style={{ marginLeft: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', width: '100%', paddingLeft: '0px' }}>
          <div
            onClick={toggleCollapsed}
            className={`toggle-button ${collapsedState ? 'collapsed' : ''}`}
            style={{
              position: 'initial',
              width: '55px',
              cursor: 'pointer',
              padding: '20px',
              bottom: '0',
              color: '#222',
              background: '#fff',
              borderTop: '1px solid #999',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 27 19"
            >
              <g
                id="Icon_feather-menu"
                data-name="Icon feather-menu"
                transform="translate(1.5 1.5)"
              >
                <path
                  id="Path_2006"
                  data-name="Path 2006"
                  d="M4.5,18h24"
                  transform="translate(-4.5 -10)"
                  fill="none"
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
                <path
                  id="Path_2007"
                  data-name="Path 2007"
                  d="M4.5,9h24"
                  transform="translate(-4.5 -9)"
                  fill="none"
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
                <path
                  id="Path_2008"
                  data-name="Path 2008"
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
          </div>
          
          {!collapsedState && isshownfilter && (
            <div onClick={togglefilter} className="me-3">
              <FontAwesomeIcon icon={faSearch} className="fa-lg" />
            </div>
          )}
          
          {!isshownfilter && (
            <div className="d-flex align-items-center w-100">
              <input
                type="text"
                placeholder="Search"
                className="form-control me-2"
                value={name}
                onChange={onSearch}
                style={{ fontFamily: 'Arial, FontAwesome' }}
              />
              <FontAwesomeIcon 
                icon={faTimes} 
                className="fa-lg" 
                onClick={togglefilter}
                style={{ cursor: 'pointer' }}
              />
            </div>
          )}
        </div>

        <div className="side-search" style={{ padding: '10px' }}>
          {sidebar.map((s, index) => (
            <div key={s.pages} className="nested-menu">
              <a 
                onClick={() => s.children.length > 0 ? addExpandClass(s.pages) : navigate(s.link)}
                // className="list-group-item list-group-item-action"
                style={{ 
                  background: '#fff', 
                  border: '0', 
                  borderRadius: '0', 
                  color: '#222',
                  cursor: 'pointer',
                  margin: '8px 0',
                  padding: '12px',
                  textDecoration: 'none',
                  paddingLeft: '10px'
                }}
              >
                <div  style={{ gap: !collapsedState ? '8px' : '3px', width: '100%', display: 'flex', alignItems: 'center' }}>
                  {s.name === 'Integration' ? (
                    <Hexagon size={24} />
                  ) : (
                    <div style={{ width: '24px', height: '24px' }} >
                        <div className={s.icon}></div>
                    </div>
                  )}
                  
                  {!collapsedState && <h1 style={{ fontSize: '16px', fontWeight: 'bold'}}>
                    {s.name}
                  </h1>}
                  
                  {s.children.length > 0 && (
                    <ChevronDown 
                      size={16}
                      className="ms-auto d-flex align-items-center"
                      style={{ 
                        transition: 'transform 0.2s ease-in-out',
                        transform: showMenu.includes(s.pages) ? 'rotate(180deg)' : 'rotate(0deg)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    />
                  )}
                </div>
              </a>
              
              <li
                className={`nested ${showMenu.includes(s.pages) ? 'expand' : ''}`}
              >
                <ul className="submenu list-unstyled" style={{ 
                  display: showMenu.includes(s.pages) ? 'block' : 'none',
                  height: showMenu.includes(s.pages) ? 'auto' : '0',
                  listStyleType: 'none',
                  paddingLeft: '0px'
                }}>
                  {s.children.map((m, index) => (
                    <li key={index} className="mt-2">
                      <a
                        onClick={() => {
                          collapseSidebar(true);
                          setActiveCard();
                        }}
                        className={`submenu-items ${location.pathname === m.link ? 'router-link-active' : ''}`}
                        style={{
                          color: '#222',
                          padding: '10px',
                          display: 'block',
                          textDecoration: 'none',
                          cursor: 'pointer'
                        }}
                        href={m.link}
                      >
                        <div className="d-flex align-items-center" style={{ gap: '8px', display: 'flex', alignItems: 'center' }}>
                          {m.name === 'Subscription' && (
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }} width="20" height="20" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
                              <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                            </svg>
                          )}
                          
                          {m.name === 'Account' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-card-text" viewBox="0 0 16 16">
                              <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                              <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                          )}
                          
                          {m.name !== 'Subscription' && m.name !== 'Account' && (
                            <div className={m.icon} style={{ width: '20px', height: '20px' }}></div>
                          )}
                          
                          <span className="flex-grow-1">
                            {m.name}
                          </span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SidebarComponent; 