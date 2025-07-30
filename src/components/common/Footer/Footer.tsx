import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="w-full flex justify-between items-center">
      <span className="created-by">
        Created with ♥ by <b><a href="https://akveo.page.link/8V2f" target="_blank" rel="noopener noreferrer">Akveo</a></b> 2019
      </span>
      <div className="socials text-3xl">
        <a href="#" target="_blank" rel="noopener noreferrer" className="ion ion-social-github p-2 text-gray-400 hover:text-gray-800 transition-colors duration-100"></a>
        <a href="#" target="_blank" rel="noopener noreferrer" className="ion ion-social-facebook p-2 text-gray-400 hover:text-gray-800 transition-colors duration-100"></a>
        <a href="#" target="_blank" rel="noopener noreferrer" className="ion ion-social-twitter p-2 text-gray-400 hover:text-gray-800 transition-colors duration-100"></a>
        <a href="#" target="_blank" rel="noopener noreferrer" className="ion ion-social-linkedin p-2 text-gray-400 hover:text-gray-800 transition-colors duration-100"></a>
      </div>
    </div>
  );
};

export default Footer;