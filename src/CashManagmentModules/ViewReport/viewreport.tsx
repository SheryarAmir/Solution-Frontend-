import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


interface FacadeReport {
  id: string;
  showDiv: {
    Epos: boolean;
    food: boolean;
    drinks: boolean;
    takeAway: boolean;
    others: boolean;
    vat: boolean;
    seviceCharges: boolean;
    creditCardTips: boolean;
    PettyCash: boolean;
    foodDrink: boolean;
    repair: boolean;
    maintenance: boolean;
    sundries: boolean;
    Pdq: boolean;
    debit: boolean;
    visa: boolean;
    amex: boolean;
    ThirdPartyTakings: boolean;
    zomato: boolean;
    delivaro: boolean;
    PendingDeposit: boolean;
    BankingDetails: boolean;
    giroSlipNumber: boolean;
    bankingTotal: boolean;
    bankedTotal: boolean;
    cashupSheetDate: boolean;
    sealedBy: boolean;
  };
  // Add other properties as needed
}

interface ReportData {
  n1: string;
  n2: string;
  n3: string;
  n4: string;
  n5: string;
  n6: string;
}

interface PdqTaking {
  sheet_date: Date;
  debit_card: number;
  visa: number;
  amex: number;
  giroSlipNumber: number;
  sealed_by: string;
}

const ViewReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reports, setReports] = useState<FacadeReport[]>([]);
  const [report, setReport] = useState<FacadeReport | null>(null);
  const [viewReport, setViewReport] = useState<any>(null);
  const [showDiv, setShowDiv] = useState({
    Epos: false,
    food: false,
    drinks: false,
    takeAway: false,
    others: false,
    vat: false,
    seviceCharges: false,
    creditCardTips: false,
    PettyCash: false,
    foodDrink: false,
    repair: false,
    maintenance: false,
    sundries: false,
    Pdq: false,
    debit: false,
    visa: false,
    amex: false,
    ThirdPartyTakings: false,
    zomato: false,
    delivaro: false,
    PendingDeposit: false,
    BankingDetails: false,
    giroSlipNumber: false,
    bankingTotal: false,
    bankedTotal: false,
    cashupSheetDate: false,
    sealedBy: false,
  });

  const tabledata: ReportData[] = [
    {
      n1: "01 Feb2021",
      n2: "AM",
      n3: "20",
      n4: "25",
      n5: "25",
      n6: "28"
    },
    {
      n1: "01 Feb2021",
      n2: "AM",
      n3: "25",
      n4: "25",
      n5: "25",
      n6: "28"
    },
    {
      n1: "01 Feb2021",
      n2: "AM",
      n3: "20",
      n4: "21",
      n5: "28",
      n6: "90"
    },
    {
      n1: "01 Feb2021",
      n2: "AM",
      n3: "25",
      n4: "25",
      n5: "25",
      n6: "28"
    },
    {
      n1: "01 Feb2021",
      n2: "AM",
      n3: "25",
      n4: "25",
      n5: "25",
      n6: "28"
    }
  ];

  const PdqTaking: PdqTaking[] = [
    {
      sheet_date: new Date(2020, 12, 1),
      debit_card: 10,
      visa: 10,
      amex: 10,
      giroSlipNumber: 10756,
      sealed_by: "John Doe"
    },
    {
      sheet_date: new Date(2020, 12, 1),
      debit_card: 10,
      visa: 10,
      amex: 10,
      giroSlipNumber: 10345,
      sealed_by: "John Doe"
    },
    {
      sheet_date: new Date(2020, 12, 1),
      debit_card: 10,
      visa: 10,
      amex: 10,
      giroSlipNumber: 10987,
      sealed_by: "John Doe"
    },
    // ... other items
  ];

  useEffect(() => {
    console.log("Selected ID: " + id);
    
    // Simulate loading reports
    // In a real app, you would call your API/services here
    const loadReports = async () => {
      // Simulate API call
      // const reportsData = await reportFacade.load();
      // setReports(reportsData);
      
      // For demo purposes, setting empty array
      setReports([]);
      
      // Simulate getting report by ID
      // const reportData = await report_service.getReportById(id);
      // setReport(reportData);
      
      // Simulate getting dummy report
      // const dummyReport = await report_service.getDummyReportById(id);
      // setViewReport(dummyReport);
      
      // Find and set showDiv based on report ID
      const foundReport = reports.find(r => r.id === id);
      if (foundReport) {
        setShowDiv(foundReport.showDiv);
      }
    };
    
    loadReports();
  }, [id]);

  const downloadEXCEL = () => {
    // this.downloadService.downloadExcel(this.viewReport);
    console.log("Download Excel functionality would go here");
  };

  return (
    <div className="p-4">
      {/* Download Button */}
      <div className="mb-4">
        <button 
          onClick={downloadEXCEL}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download Excel
        </button>
      </div>

      {/* Report Card */}
      <div className="card bg-white rounded-lg shadow-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Report Details</h2>
        
        {/* Basic Info Table */}
        <table className="my-info w-full mb-6">
          <thead>
            <tr>
              <th className="text-left py-2">Heading 1</th>
              <th className="text-left py-2">Heading 2</th>
              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-300">
              <td className="py-2">Data 1</td>
              <td className="py-2">Data 2</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>

        {/* Conditional Sections */}
        {showDiv.Epos && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">EPOS Section</h3>
            <table className="my-info1 w-full">
              <thead>
                <tr>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Period</th>
                  <th className="text-left py-2">Value 1</th>
                  <th className="text-left py-2">Value 2</th>
                </tr>
              </thead>
              <tbody>
                {tabledata.map((item, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="py-2">{item.n1}</td>
                    <td className="py-2">{item.n2}</td>
                    <td className="py-2">{item.n3}</td>
                    <td className="py-2">{item.n4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showDiv.Pdq && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">PDQ Section</h3>
            <table className="my-info1 w-full">
              <thead>
                <tr>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Debit Card</th>
                  <th className="text-left py-2">Visa</th>
                  <th className="text-left py-2">Amex</th>
                </tr>
              </thead>
              <tbody>
                {PdqTaking.map((item, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="py-2">{item.sheet_date.toLocaleDateString()}</td>
                    <td className="py-2">{item.debit_card}</td>
                    <td className="py-2">{item.visa}</td>
                    <td className="py-2">{item.amex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add other conditional sections similarly */}
      </div>
    </div>
  );
};

export default ViewReport;