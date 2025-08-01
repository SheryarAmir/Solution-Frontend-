import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import rosLogo from '../../../assets/images/ROS_FINAL-07.png';
import profileImage from '../../../assets/images/profile.png';

interface UserProfile {
  userProfile: {
    imageURL: string;
  };
}

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [azureName, setAzureName] = useState<string>('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');

  useEffect(() => {
    // Initialize data from localStorage and services
    const storedAzureName = localStorage.getItem('AzureName');
    if (storedAzureName) {
      setAzureName(storedAzureName);
    }

    // Mock restaurant data - replace with actual service call
    setRestaurants(['Restaurant 1', 'Restaurant 2', 'Restaurant 3']);
    setSelectedRestaurant('Restaurant 1');

    // Mock profile data - replace with actual API call
    setProfile({
      userProfile: {
        imageURL: ''
      }
    });

    // Handle responsive sidebar toggle
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        // Auto-close sidebar on mobile
        // This would trigger the sidebar toggle if needed
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRestaurantChange = (restaurant: string) => {
    setSelectedRestaurant(restaurant);
    // In a real app, you would call your service here
    // authFacade.changeRestaurants(restaurant);
    window.location.reload();
  };

  const handleUserClick = () => {
    // Log user details - replace with actual service call
    console.log('User clicked');
  };

  const logout = () => {
    authFacade.logout();
    navigate('/signin', { replace: true });
  };

  const getProfileImage = () => {
    if (profile?.userProfile.imageURL && 
        profile.userProfile.imageURL !== 'string' && 
        profile.userProfile.imageURL !== '') {
      return profile.userProfile.imageURL;
    }
    return profileImage;
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-white shadow-sm"
      style={{
        position: 'fixed', // Ensure navbar is fixed at the top
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1050,
        backgroundColor: '#fff',
        boxShadow: '0px 20px 80px #00000011',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '64px',
        paddingLeft: '32px',   // Added padding left
        paddingRight: '32px',  // Added padding right
        width: '100%',
      }}
    >
      <div
        className="col col-auto navbar-brand cursor-pointer"
        onClick={handleUserClick}
        style={{ padding: '1px', color: '#222', display: 'flex', alignItems: 'center' }}
      >
        <img
          src={rosLogo}
          className="ROS_Logo"
          alt="ROS Logo"
          style={{ width: '118px', transform: 'translateX(-20px)' }}
        />
      </div>

      <div
        className="col container-fluid"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <div
          className="row ml-auto pull-right"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <div className="m-auto d-flex" style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className="vl ml-sm-3 mr-sm-2"
              style={{
                height: '30px',
                borderRight: '2px solid #ebebf2',
                opacity: '50%',
                marginTop: '5px'
              }}
            ></div>

            <Menu as="div" className="relative">
              <Menu.Button className="img-container cursor-pointer">
                <img
                  src={getProfileImage()}
                  className="img-container cursor-pointer"
                  title={azureName}
                  id="user_setting_dropdown"
                  alt="User Profile"
                  style={{
                    display: 'inline-block',
                    width: '40px',
                    height: '40px',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    borderRadius: '50%'
                  }}
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                      >
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header; 