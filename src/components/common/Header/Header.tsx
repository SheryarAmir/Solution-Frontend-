import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Profile {
  userProfile: {
    imageURL: string;
  };
}

interface HeaderProps {
  authFacade: {
    logout: () => void;
    getUserDetails: () => any;
    getAllUserRestaurants: () => any[];
    getRestaurant: () => any;
    changeRestaurants: (res: string) => void;
  };
  userInfoService: {
    getUsersInfo: (name: string) => Promise<Profile>;
  };
}

const Header: React.FC<HeaderProps> = ({ authFacade, userInfoService }) => {
  const [pushRightClass, setPushRightClass] = useState('push-right');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [azureName, setAzureName] = useState<string>('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setRestaurants(authFacade.getAllUserRestaurants());
    setSelectedRestaurant(authFacade.getRestaurant());
    const name = localStorage.getItem("AzureName");
    if (name) setAzureName(name);
    
    const fetchUserInfo = async () => {
      const givenName = localStorage.getItem('given_name');
      if (givenName) {
        const userInfo = await userInfoService.getUsersInfo(givenName);
        setProfile(userInfo);
      }
    };
    
    fetchUserInfo();
  }, [authFacade, userInfoService]);

  const changeRestaurant = (res: string) => {
    authFacade.changeRestaurants(res);
    window.location.reload();
  };

  const getUser = () => {
    console.log("User", authFacade.getUserDetails());
  };

  const logout = () => {
    authFacade.logout();
    navigate('/signin', { replace: true });
  };

  const isToggled = (): boolean => {
    const dom = document.querySelector("body");
    return dom?.classList.contains(pushRightClass) || false;
  };

  const toggleSidebar = () => {
    const dom = document.querySelector("body");
    dom?.classList.toggle(pushRightClass);
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top w-full bg-white shadow-md h-18">
      <a className="col col-auto navbar-brand" onClick={getUser}>
        <img
          src="/assets/images/ROS_FINAL-07.png"
          className="ROS_Logo w-[118px] -translate-x-5"
          alt="ROS Logo"
        />
      </a>

      <div className="col w-full">
        <div className="row ml-auto float-right">
          <div className="m-auto flex">
            <div className="vl ml-3 mr-2 h-[30px] border-r-2 border-gray-200 opacity-50 mt-1"></div>
            <div className="user_setting relative">
              {profile?.userProfile.imageURL === 'string' || profile?.userProfile.imageURL === '' ? (
                <img
                  src="/assets/images/profile.png"
                  className="img-container cursor-pointer w-10 h-10 rounded-full bg-center bg-cover"
                  title={azureName}
                  id="user_setting_dropdown"
                  alt="ROS Logo"
                />
              ) : (
                <img
                  src={profile?.userProfile.imageURL}
                  className="img-container cursor-pointer w-10 h-10 rounded-full bg-center bg-cover"
                  title={azureName}
                  id="user_setting_dropdown"
                  alt="ROS Logo"
                />
              )}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <button 
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;