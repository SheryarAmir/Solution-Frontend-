import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import { Download } from 'react-feather';
import { format } from 'date-fns';

interface CashUp {
  cashUpDate: Date;
  cashUpTimeIndicator: string;
  sales: Array<{
    foodPayment: number;
    drinksPayment: number;
    takeAwayPayment: number;
    otherPayment: number;
    taxInfo: Array<{ name: string; amount: number }>;
    creditCardTip: number;
    serviceCharges: number;
  }>;
  epostotal: number;
  cashtotal: number;
  pdqtotal: number;
  deliverytotal: number;
  kpitotal: number;
  cashnPdq: {
    wageAdvances: Array<{ employeeId: string; amount: number }>;
    pettyCashs: Array<{ pettyCashName: string; amount: number }>;
    tillSystems: Array<{ name: string; amount: number }>;
    pdqSystems: Array<{ name: string; cardName: string; amount: number }>;
  };
  thirdPartyInfo: Array<{ name: string; amount: number }>;
  kpi: {
    kpiCovers: Array<{ kpiName: string; amount: number }>;
    breakDownDetails: Array<{
      name: string;
      billNumber: string;
      breakDownReason: string;
      amount: number;
    }>;
  };
  safeSummary: {
    safeCount: number;
    safeTillAmount: number;
    bankedAmount: number;
  };
  difference: number;
  reason: string;
  reasonAddedBy: string;
  cashUpStatus: string;
}

interface Configuration {
  currency_sym: string;
  company_code: string;
  complaints: any[];
  reasons: Array<{ code: string; value: string }>;
  pdq_card: Array<{ field_name: string }>;
  pdqs: Array<{ field_name: string }>;
}

const ViewCashupComponent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [downloadOptions, setDownloadOptions] = useState(false);
  const [cashupsDownObj, setCashupsDownObj] = useState<any[]>([]);
  const [cash_obj, setCashObj] = useState<CashUp | null>(null);
  const [currSym, setCurrSym] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [configurations, setConfigurations] = useState<Configuration | null>(null);
  const [pdq_cards, setPdqCards] = useState<Array<{ field_name: string }>>([]);
  const [pdqs, setPdqs] = useState<Array<{ field_name: string }>>([]);
  const [reasons, setReasons] = useState<Array<{ code: string; value: string }>>([]);
  
  // Data arrays
  const [Epos, setEpos] = useState<Array<{ id: string; title: string; value: number }>>([]);
  const [PettyCash, setPettyCash] = useState<Array<{ id: string; title: string; value: number }>>([]);
  const [Till, setTill] = useState<Array<{ id: string; title: string; value: number }>>([]);
  const [Wage, setWage] = useState<Array<{ id: string; name: string; dept: string; adv: number }>>([]);
  const [PDQ, setPDQ] = useState<Array<{ pdq: string; fields: Array<{ name: string; value?: number }> }>>([]);
  const [TPT, setTPT] = useState<Array<{ id: string; title: string; value: number }>>([]);
  const [Cover, setCover] = useState<Array<{ id: string; title: string; value: number }>>([]);
  const [Refund, setRefund] = useState<Array<{ id: string; name: string; billnumber: string; reason: string; amount: number }>>([]);
  const [Discount, setDiscount] = useState<Array<{ id: string; name: string; billnumber: string; reason: string; amount: number }>>([]);

  // Totals
  const [Epos_Talkings, setEposTalkings] = useState<number>(0);
  const [Tills, setTills] = useState<number>(0);
  const [PdqSystems, setPdqSystems] = useState<number>(0);
  const [Wages, setWages] = useState<number>(0);
  const [Petty, setPetty] = useState<number>(0);
  const [Third_Party, setThirdParty] = useState<number>(0);
  const [Covers, setCovers] = useState<number>(0);
  const [refund, setRefundTotal] = useState<number>(0);
  const [discount, setDiscountTotal] = useState<number>(0);

  useEffect(() => {
    // Initialize with location state or redirect
    if (location.state?.cash_obj) {
      setCashObj(location.state.cash_obj);
      initializeData(location.state.cash_obj);
    } else {
      navigate("/accounting/cashup", { state: { viewState: "ALL" } });
    }
  }, [location, navigate]);

  const initializeData = (cashupData: CashUp) => {
    // Mock configuration - replace with actual data fetching
    const mockConfig: Configuration = {
      currency_sym: "$",
      company_code: "COMP001",
      complaints: [],
      reasons: [
        { code: "R001", value: "Customer Complaint" },
        { code: "R002", value: "Wrong Order" }
      ],
      pdq_card: [
        { field_name: "Visa" },
        { field_name: "MasterCard" },
        { field_name: "Amex" }
      ],
      pdqs: [
        { field_name: "iZettle" },
        { field_name: "Square" }
      ]
    };

    setConfigurations(mockConfig);
    setCurrSym(mockConfig.currency_sym);
    setCode(mockConfig.company_code);
    setReasons(mockConfig.reasons);
    setPdqCards([...mockConfig.pdq_card].sort((a, b) => a.field_name.localeCompare(b.field_name)));
    setPdqs([...mockConfig.pdqs].sort((a, b) => a.field_name.localeCompare(b.field_name)));

    // Process Epos data
    const eposData = [
      { id: "", title: "Food", value: cashupData.sales[0].foodPayment },
      { id: "", title: "Drinks", value: cashupData.sales[0].drinksPayment },
      { id: "", title: "Take Away", value: cashupData.sales[0].takeAwayPayment },
      { id: "", title: "Other", value: cashupData.sales[0].otherPayment },
      ...cashupData.sales[0].taxInfo.map(x => ({ id: "", title: x.name, value: x.amount })),
      { id: "", title: "Service Charges", value: cashupData.sales[0].serviceCharges },
      { id: "", title: "CC Tip", value: cashupData.sales[0].creditCardTip }
    ];
    setEpos(eposData);

    // Process Wage Advances
    const wageData = cashupData.cashnPdq.wageAdvances?.map(x => ({
      id: x.employeeId,
      name: "John Doe",
      dept: "Management",
      adv: x.amount
    })) || [];
    setWage(wageData);

    // Process Petty Cash
    const pettyData = cashupData.cashnPdq.pettyCashs?.map(x => ({
      id: "",
      title: x.pettyCashName,
      value: x.amount
    })) || [];
    setPettyCash(pettyData);

    // Process Till
    const tillData = cashupData.cashnPdq.tillSystems?.map(x => ({
      id: "",
      title: x.name,
      value: x.amount
    })) || [];
    setTill(tillData);

    // Process Third Party
    const tptData = cashupData.thirdPartyInfo?.map(x => ({
      id: "",
      title: x.name,
      value: x.amount
    })) || [];
    setTPT(tptData);

    // Process Covers
    const coverData = cashupData.kpi.kpiCovers?.map(x => ({
      id: "",
      title: x.kpiName,
      value: x.amount
    })) || [];
    setCover(coverData);

    // Process Refund Breakdown
    const refundData = cashupData.kpi.breakDownDetails
      ?.filter(x => x.name === "refund_breakdown")
      .map(x => {
        const res = mockConfig.reasons.find(r => r.code === x.breakDownReason);
        return {
          id: "",
          name: x.name,
          billnumber: x.billNumber,
          reason: res ? res.value : x.breakDownReason,
          amount: x.amount
        };
      }) || [];
    setRefund(refundData);

    // Process Discount Breakdown
    const discountData = cashupData.kpi.breakDownDetails
      ?.filter(x => x.name === "discount_breakdown")
      .map(x => {
        const res = mockConfig.reasons.find(r => r.code === x.breakDownReason);
        return {
          id: "",
          name: x.name,
          billnumber: x.billNumber,
          reason: res ? res.value : x.breakDownReason,
          amount: x.amount
        };
      }) || [];
    setDiscount(discountData);

    // Process PDQ Takings
    const pdqData = mockConfig.pdqs.map(pdq => {
      const fields = mockConfig.pdq_card.map(card => ({
        name: card.field_name,
        value: cashupData.cashnPdq.pdqSystems.find(
          y => y.cardName === card.field_name && y.name === pdq.field_name
        )?.amount
      }));
      return { pdq: pdq.field_name, fields };
    });
    setPDQ(pdqData);

    // Set totals (mock values - replace with actual calculations)
    setEposTalkings(cashupData.epostotal);
    setTills(cashupData.cashtotal);
    setPdqSystems(cashupData.pdqtotal);
    setWages(cashupData.cashnPdq.wageAdvances?.reduce((sum, x) => sum + x.amount, 0) || 0);
    setPetty(cashupData.cashnPdq.pettyCashs?.reduce((sum, x) => sum + x.amount, 0) || 0);
    setThirdParty(cashupData.deliverytotal);
    setCovers(cashupData.kpi.kpiCovers?.reduce((sum, x) => sum + x.amount, 0) || 0);
    setRefundTotal(refundData.reduce((sum, x) => sum + x.amount, 0));
    setDiscountTotal(discountData.reduce((sum, x) => sum + x.amount, 0));
  };

  const formatDownloadData = () => {
    if (!cash_obj) return;

    const cashupObj: Record<string, string> = {};
    let i = 0;

    cashupObj["Date"] = format(new Date(cash_obj.cashUpDate), "dd/MM/yyyy");
    cashupObj["Time"] = cash_obj.cashUpTimeIndicator;

    cash_obj.sales.forEach(y => {
      cashupObj["Food"] = `${currSym} ${y.foodPayment.toFixed(2)}`;
      cashupObj["Drinks"] = `${currSym} ${y.drinksPayment.toFixed(2)}`;
      cashupObj["Take away"] = `${currSym} ${y.takeAwayPayment.toFixed(2)}`;
      cashupObj["Others"] = `${currSym} ${y.otherPayment.toFixed(2)}`;
      y.taxInfo.forEach(taxes => {
        cashupObj[taxes.name] = `${currSym} ${taxes.amount.toFixed(2)}`;
      });
      cashupObj["CC Tip"] = `${currSym} ${y.creditCardTip.toFixed(2)}`;
      cashupObj["Service Charge"] = `${currSym} ${y.serviceCharges.toFixed(2)}`;
    });
    cashupObj["Epos Total"] = `${currSym} ${cash_obj.epostotal.toFixed(2)}`;

    cash_obj.cashnPdq.pettyCashs?.forEach(y => {
      cashupObj[y.pettyCashName] = `${currSym} ${y.amount.toFixed(2)}`;
    });

    cash_obj.cashnPdq.tillSystems?.forEach(y => {
      cashupObj[y.name] = `${currSym} ${y.amount.toFixed(2)}`;
    });
    cashupObj["Cash Total"] = `${currSym} ${cash_obj.cashtotal.toFixed(2)}`;

    cash_obj.cashnPdq.pdqSystems?.forEach(y => {
      cashupObj[`${y.name}: ${y.cardName}`] = `${currSym} ${y.amount.toFixed(2)}`;
    });
    cashupObj["PDQ Total"] = `${currSym} ${cash_obj.pdqtotal.toFixed(2)}`;

    cash_obj.cashnPdq.wageAdvances?.forEach(y => {
      cashupObj[`Wage: Employee ${i++}`] = `${currSym} ${y.amount.toFixed(2)}`;
    });

    cash_obj.thirdPartyInfo?.forEach(y => {
      cashupObj[y.name] = `${currSym} ${y.amount.toFixed(2)}`;
    });
    cashupObj["Delivery Total"] = `${currSym} ${cash_obj.deliverytotal.toFixed(2)}`;

    cash_obj.kpi.kpiCovers?.forEach(y => {
      cashupObj[y.kpiName] = `${currSym} ${y.amount.toFixed(2)}`;
    });

    cash_obj.kpi.breakDownDetails?.forEach(y => {
      cashupObj[y.name] = `${currSym} ${y.amount.toFixed(2)}`;
    });

    cashupObj["KPI Total"] = `${currSym} ${cash_obj.kpitotal.toFixed(2)}`;
    cashupObj["Safe Count"] = `${currSym} ${cash_obj.safeSummary.safeCount.toFixed(2)}`;
    cashupObj["Safe Till Amount"] = `${currSym} ${cash_obj.safeSummary.safeTillAmount.toFixed(2)}`;
    cashupObj["Banked Amount"] = `${currSym} ${cash_obj.safeSummary.bankedAmount.toFixed(2)}`;
    cashupObj["Difference"] = `${currSym} ${cash_obj.difference.toFixed(2)}`;
    cashupObj["Reason"] = cash_obj.reason;
    cashupObj["Reason By"] = cash_obj.reasonAddedBy;
    cashupObj["Status"] = cash_obj.cashUpStatus;

    setCashupsDownObj([cashupObj]);
  };

  const downloadEXCEL = () => {
    formatDownloadData();
    if (cashupsDownObj.length > 0) {
      // Implement Excel download logic here
      console.log("Downloading Excel:", cashupsDownObj);
    }
  };

  const downloadCSV = () => {
    formatDownloadData();
    if (cashupsDownObj.length > 0) {
      // Implement CSV download logic here
      console.log("Downloading CSV:", cashupsDownObj);
    }
  };

  if (!cash_obj) return null;

  return (
    <div className="bg-white min-h-screen">
      {/* Top Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 px-5 py-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-3">
              <ArrowLeft size={24} className="text-black" />
            </button>
            <div className="ml-3">
              <div className="text-xl font-semibold">
                {format(new Date(cash_obj.cashUpDate), "dd MMM yyyy")}, {cash_obj.cashUpTimeIndicator}
              </div>
              <div className="flex items-center mt-2">
                <img
                  src="/assets/images/nick.png"
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium">John Doe</div>
                  <div className="text-xs text-gray-500">FOH_1011</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="relative inline-block">
              <button
                onClick={() => setDownloadOptions(!downloadOptions)}
                onMouseEnter={() => setDownloadOptions(true)}
                className="flex items-center bg-black text-white px-3 py-1 rounded text-sm"
              >
                <Download size={16} className="mr-1" />
                DOWNLOAD
              </button>
              {downloadOptions && (
                <div 
                  className="absolute right-0 mt-1 bg-white shadow-lg rounded z-20"
                  onMouseLeave={() => setDownloadOptions(false)}
                >
                  <button
                    onClick={() => {
                      downloadCSV();
                      setDownloadOptions(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => {
                      downloadEXCEL();
                      setDownloadOptions(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    EXCEL
                  </button>
                </div>
              )}
            </div>
            <div className="mt-1 text-xs">
              {code}_{format(new Date(cash_obj.cashUpDate), "ddMMMyyyy")}_{cash_obj.cashUpTimeIndicator}
              {cash_obj.cashUpTimeIndicator === "AM" ? "_001" : "_002"}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pt-24 pb-8 px-5">
        {/* EPOS Takings */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h6 className="font-medium text-lg">EPOS Takings</h6>
            <p className="text-sm">
              Total: <span className="font-bold">{currSym} {cash_obj.epostotal.toFixed(2)}</span>
            </p>
          </div>
          <hr className="my-2" />
          <div className="grid grid-cols-4 gap-4">
            {Epos.map((item, index) => (
              <div key={index}>
                <div className="text-sm text-gray-600">{item.title}</div>
                <div className="font-medium">{currSym} {item.value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Petty Cash */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h6 className="font-medium text-lg">Petty Cash</h6>
            <p className="text-sm">
              Total: <span className="font-bold">{currSym} {Petty.toFixed(2)}</span>
            </p>
          </div>
          <hr className="my-2" />
          <div className="grid grid-cols-4 gap-4">
            {PettyCash.map((item, index) => (
              <div key={index}>
                <div className="text-sm text-gray-600">{item.title}</div>
                <div className="font-medium">{currSym} {item.value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Till */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h6 className="font-medium text-lg">Till</h6>
            <p className="text-sm">
              Total: <span className="font-bold">{currSym} {cash_obj.cashtotal.toFixed(2)}</span>
            </p>
          </div>
          <hr className="my-2" />
          <div className="grid grid-cols-4 gap-4">
            {Till.map((item, index) => (
              <div key={index}>
                <div className="text-sm text-gray-600">{item.title}</div>
                <div className="font-medium">{currSym} {item.value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wage Advances */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h6 className="font-medium text-lg">Wage Advances</h6>
            <p className="text-sm">
              Total: <span className="font-bold">{currSym} {Wages.toFixed(2)}</span>
            </p>
          </div>
          <hr className="my-2" />
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-2">Emp ID</th>
                  <th className="pb-2">Emp Name</th>
                  <th className="pb-2">Department</th>
                  <th className="pb-2">Advance Provided</th>
                </tr>
              </thead>
              <tbody>
                {Wage.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2">{item.id}</td>
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">{item.dept}</td>
                    <td className="py-2">{currSym} {item.adv.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PDQ Takings */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h6 className="font-medium text-lg">PDQ Takings</h6>
            <p className="text-sm">
              Total: <span className="font-bold">{currSym} {cash_obj.pdqtotal.toFixed(2)}</span>
            </p>
          </div>
          <hr className="my-2" />
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-2">PDQ</th>
                  {pdq_cards.map((card, index) => (
                    <th key={index} className="pb-2">{card.field_name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PDQ.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2">{item.pdq}</td>
                    {item.fields.map((field, fIndex) => (
                      <td key={fIndex} className="py-2">
                        {field.value ? `${currSym} ${field.value.toFixed(2)}` : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Third Party Takings */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h6 className="font-medium text-lg">Third Party Takings</h6>
            <p className="text-sm">
              Total: <span className="font-bold">{currSym} {cash_obj.deliverytotal.toFixed(2)}</span>
            </p>
          </div>
          <hr className="my-2" />
          <div className="grid grid-cols-4 gap-4">
            {TPT.map((item, index) => (
              <div key={index}>
                <div className="text-sm text-gray-600">{item.title}</div>
                <div className="font-medium">{currSym} {item.value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Covers */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h6 className="font-medium text-lg">Covers</h6>
            <p className="text-sm">
              Total: <span className="font-bold">{currSym} {Covers.toFixed(2)}</span>
            </p>
          </div>
          <hr className="my-2" />
          <div className="grid grid-cols-4 gap-4">
            {Cover.map((item, index) => (
              <div key={index}>
                <div className="text-sm text-gray-600">{item.title}</div>
                <div className="font-medium">{currSym} {item.value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h6 className="font-medium text-lg">Refund Breakdown</h6>
            <p className="text-sm">
              Total: <span className="font-bold">{currSym} {refund.toFixed(2)}</span>
            </p>
          </div>
          <hr className="my-2" />
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-2">Bill Number</th>
                  <th className="pb-2">Reason</th>
                  <th className="pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {Refund.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2">{item.billnumber}</td>
                    <td className="py-2">{item.reason}</td>
                    <td className="py-2">{currSym} {item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Discount Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h6 className="font-medium text-lg">Discount Breakdown</h6>
            <p className="text-sm">
              Total: <span className="font-bold">{currSym} {discount.toFixed(2)}</span>
            </p>
          </div>
          <hr className="my-2" />
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-2">Bill Number</th>
                  <th className="pb-2">Reason</th>
                  <th className="pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {Discount.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2">{item.billnumber}</td>
                    <td className="py-2">{item.reason}</td>
                    <td className="py-2">{currSym} {item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCashupComponent;