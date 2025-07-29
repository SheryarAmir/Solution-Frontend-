import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/react';

interface CashupSidebarProps {
  tab_name?: string;
  onTabNameChange?: (tabName: string) => void;
}

const CashupSidebar: React.FC<CashupSidebarProps> = ({ 
  tab_name: initialTab = 'epos', 
  onTabNameChange 
}) => {
  const [tabName, setTabName] = useState(initialTab);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const popupContentRef = useRef(null);

  const setFormTab = (tab: string) => {
    setTabName(tab);
    if (onTabNameChange) {
      onTabNameChange(tab);
    }
  };

  const back = () => {
    navigate('/accounting/cashup');
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="sidenav shadow-[0px_-10px_20px_rgba(199,199,199,0.41)] h-screen w-full md:w-64 fixed md:relative bg-white">
      <div className="nav-list">
        {['epos', 'cash', 'card', 'other'].map((tab) => (
          <div
            key={tab}
            className={`nav-item px-5 py-4 cursor-pointer ${
              tabName === tab
                ? 'shadow-[inset_0px_11px_8px_-5px_#ccc,inset_0px_-11px_8px_-5px_#ccc]'
                : ''
            }`}
            onClick={() => setFormTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}

        <div className="px-5 py-4 space-x-4">
          <button
            onClick={back}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Back
          </button>
          <button
            onClick={openPopup}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Open Popup
          </button>
        </div>
      </div>

      {/* Popup Dialog */}
      <Dialog
        open={isPopupOpen}
        onClose={closePopup}
        initialFocus={popupContentRef}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="deleteCard bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <DialogTitle className="text-lg font-medium mb-4">
              Popup Title
            </DialogTitle>
            <DialogDescription className="mb-4">
              This is the popup content area.
            </DialogDescription>
            <button
              onClick={closePopup}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Close
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default CashupSidebar;