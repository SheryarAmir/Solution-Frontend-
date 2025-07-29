import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Report {
  id: string;
  // Add other report properties as needed
}

interface ShowDivState {
  Epo: boolean;
  food: boolean;
  drinks: boolean;
  takeAway: boolean;
  others: boolean;
  vat: boolean;
  seviceCharges: boolean;
  creditCardTips: boolean;
  PettyCash: boolean;
  fd: boolean;
  repair: boolean;
  maintenance: boolean;
  sundries: boolean;
  Pdq: boolean;
  debit: boolean;
  visa: boolean;
  amex: boolean;
  Tpt: boolean;
  zomato: boolean;
  delivaro: boolean;
  Pdd: boolean;
  Brf: boolean;
  giro: boolean;
  banking: boolean;
  banked: boolean;
  cashup: boolean;
  sealed: boolean;
}

const EditReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [showDiv, setShowDiv] = useState<ShowDivState>({
    Epo: true,
    food: true,
    drinks: true,
    takeAway: true,
    others: false,
    vat: true,
    seviceCharges: false,
    creditCardTips: false,
    PettyCash: true,
    fd: true,
    repair: true,
    maintenance: true,
    sundries: true,
    Pdq: false,
    debit: true,
    visa: true,
    amex: true,
    Tpt: false,
    zomato: true,
    delivaro: true,
    Pdd: false,
    Brf: false,
    giro: true,
    banking: true,
    banked: true,
    cashup: false,
    sealed: false,
  });

  useEffect(() => {
    // Simulate loading report data
    const loadReport = async () => {
      try {
        // In a real app, you would call your API/service here
        // const reportData = await report_service.getReportById(id);
        // setReport(reportData);
        
        // For demo purposes, setting a dummy report
        setReport({ id: id || '' });
      } catch (error) {
        console.error("Error loading report:", error);
      }
    };

    loadReport();
  }, [id]);

  const onSubmit = () => {
    console.log("Form submitted");
    // Add your form submission logic here
  };

  const handleCheckboxChange = (field: keyof ShowDivState, isChecked: boolean) => {
    setShowDiv(prev => ({
      ...prev,
      [field]: isChecked
    }));
    console.log("Checkbox changed:", field, isChecked);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Report</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* EPOS Section */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="Epo"
              checked={showDiv.Epo}
              onChange={(e) => handleCheckboxChange('Epo', e.target.checked)}
              className="h-5 w-5 text-gray-700 rounded focus:ring-gray-500"
            />
            <label htmlFor="Epo" className="ml-2 block text-lg font-medium text-gray-700">
              EPOS
            </label>
          </div>

          {showDiv.Epo && (
            <div className="ml-8 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="food"
                  checked={showDiv.food}
                  onChange={(e) => handleCheckboxChange('food', e.target.checked)}
                  className="h-4 w-4 text-gray-700 rounded focus:ring-gray-500"
                />
                <label htmlFor="food" className="ml-2 text-gray-700">Food</label>
              </div>
              {/* Add other EPOS sub-options */}
            </div>
          )}
        </div>

        {/* Petty Cash Section */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="PettyCash"
              checked={showDiv.PettyCash}
              onChange={(e) => handleCheckboxChange('PettyCash', e.target.checked)}
              className="h-5 w-5 text-gray-700 rounded focus:ring-gray-500"
            />
            <label htmlFor="PettyCash" className="ml-2 block text-lg font-medium text-gray-700">
              Petty Cash
            </label>
          </div>

          {showDiv.PettyCash && (
            <div className="ml-8 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fd"
                  checked={showDiv.fd}
                  onChange={(e) => handleCheckboxChange('fd', e.target.checked)}
                  className="h-4 w-4 text-gray-700 rounded focus:ring-gray-500"
                />
                <label htmlFor="fd" className="ml-2 text-gray-700">Food & Drink</label>
              </div>
              {/* Add other Petty Cash sub-options */}
            </div>
          )}
        </div>

        {/* Add other sections similarly */}

        {/* Submit Button */}
        <div className="mt-8">
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReport;