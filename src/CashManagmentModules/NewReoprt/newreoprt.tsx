import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react'; // Replacing NbDialogService

interface CashUp {
  // Define your CashUp interface properties here
  id: string;
  // Add other properties as needed
}

interface PdqTaking {
  sheet_date: Date;
  debit_card: number;
  visa: number;
  amex: number;
  giroSlipNumber: number;
  sealed_by: string;
}

const NewReport: React.FC = () => {
  const navigate = useNavigate();
  const [allCashup, setAllCashup] = useState<CashUp[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDiv, setShowDiv] = useState({
    Epos: false,
    food: true,
    drinks: true,
    takeAway: true,
    others: true,
    vat: true,
    seviceCharges: true,
    creditCardTips: true,
    PettyCash: false,
    foodDrink: true,
    repair: true,
    maintenance: true,
    sundries: true,
    Pdq: false,
    debit: true,
    visa: true,
    amex: true,
    ThirdPartyTakings: false,
    zomato: true,
    delivaro: true,
    PendingDeposit: false,
    BankingDetails: false,
    giroSlipNumber: true,
    bankingTotal: true,
    bankedTotal: true,
    cashupSheetDate: true,
    sealedBy: true,
  });

  const PdqTaking: PdqTaking[] = [
    {
      sheet_date: new Date(2020, 12, 1),
      debit_card: 10,
      visa: 10,
      amex: 10,
      giroSlipNumber: 10756,
      sealed_by: "John Doe",
    },
    // ... other items
  ];

  useEffect(() => {
    // Simulate loading cashup data
    const loadCashupData = async () => {
      // In a real app, you would call your API/service here
      // const cashupData = await cashupFacade.load();
      // setAllCashup(cashupData);
      
      // For demo purposes, setting empty array
      setAllCashup([]);
    };
    
    loadCashupData();
  }, []);

  const onSubmit = () => {
    if (saveCheck()) {
      // Good to go for save
      console.log("Form is valid, ready to save");
    } else {
      // Show validation error
      alert("You must select at least one report section");
    }
  };

  const saveReport = () => {
    setIsSaveDialogOpen(true);
  };

  const onChecked = (obj: keyof typeof showDiv, isChecked: boolean) => {
    setShowDiv(prev => ({
      ...prev,
      [obj]: isChecked
    }));
  };

  const saveCheck = () => {
    return (
      showDiv.Epos ||
      showDiv.PettyCash ||
      showDiv.Pdq ||
      showDiv.ThirdPartyTakings ||
      showDiv.PendingDeposit ||
      showDiv.BankingDetails
    );
  };

  const allreports = () => {
    navigate("/accounting/report/home");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">New Report</h1>

      {/* Date Range Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      {/* Report Sections */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Select Report Sections</h2>

        {/* EPOS Section */}
        <div className="mb-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={showDiv.Epos}
              onChange={(e) => onChecked('Epos', e.target.checked)}
              className="form-checkbox h-5 w-5 text-gray-600"
            />
            <span className="text-gray-700 font-medium">EPOS</span>
          </label>
          {showDiv.Epos && (
            <div className="ml-8 mt-2 space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={showDiv.food}
                  onChange={(e) => onChecked('food', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-gray-600"
                />
                <span className="text-gray-700">Food</span>
              </label>
              {/* Add other EPOS sub-options similarly */}
            </div>
          )}
        </div>

        {/* Petty Cash Section */}
        <div className="mb-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={showDiv.PettyCash}
              onChange={(e) => onChecked('PettyCash', e.target.checked)}
              className="form-checkbox h-5 w-5 text-gray-600"
            />
            <span className="text-gray-700 font-medium">Petty Cash</span>
          </label>
          {/* Add sub-options for Petty Cash */}
        </div>

        {/* Add other report sections similarly */}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={allreports}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveReport}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Save
          </button>
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <Dialog
        open={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="bg-white rounded-lg max-w-md mx-auto p-6 z-20">
            <Dialog.Title className="text-lg font-bold mb-4">Save Report</Dialog.Title>
            <Dialog.Description className="mb-4">
              Are you sure you want to save this report?
            </Dialog.Description>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsSaveDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default NewReport;