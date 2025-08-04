import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isSameDay, subDays, format } from 'date-fns';

// Type definitions
type CashUp = {
  cashUpStatus: 'DRAFT' | 'IMPORT DRAFT' | 'PUBLISHED';
  cashUpDate: Date;
  cashtotal: number;
  // Add other properties as needed
  cashnPdq?: {
    tillSystems: {
      amount: number;
    }[];
  };
};

type CashupFacadeService = {
  cashupList$: {
    subscribe: (callback: (data: CashUp[]) => void) => { unsubscribe: () => void };
  };
  load: () => void;
  filterByDateRange: (range: { start_date: Date; end_date: Date }) => void;
  getCashupTotals: (cashup: CashUp) => { cash: number };
};

type DateRange = {
  start_date: Date;
  end_date: Date;
};

type SummaryData = {
  yesterdayTotal: number;
  todayTotal: number;
  yesterdayPercent: number;
  todayPercent: number;
  showAddNew: boolean;
};

// Mock facade service - replace with actual implementation
const createCashupFacadeService = (): CashupFacadeService => ({
  cashupList$: {
    subscribe: (callback) => {
      // Mock data - replace with actual observable
      const mockData: CashUp[] = [];
      callback(mockData);
      return { unsubscribe: () => {} };
    },
  },
  load: () => {},
  filterByDateRange: () => {},
  getCashupTotals: (cashup) => ({ cash: cashup.cashtotal || 0 }),
});

const CashUpComponent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [cashupFacade] = useState<CashupFacadeService>(createCashupFacadeService());
  const [selectedCard, setSelectedCard] = useState<string>(
    (location.state as { viewState?: string })?.viewState || 'ALL'
  );
  const [allDeposit, setAllDeposit] = useState<CashUp[]>([]);
  const [allBanking] = useState<any[]>([]);
  const [allCashup, setAllCashup] = useState<CashUp[]>([]);
  const [filterCashup, setFilterCashup] = useState<CashUp[]>([]);
  const [totalDrafts, setTotalDrafts] = useState<number>(0);
  const [range, setRange] = useState<DateRange>({
    start_date: new Date(),
    end_date: new Date(),
  });
  const [depositsFilter, setDepositsFilter] = useState<string>('M');
  const [percentage] = useState<number>(-200);

  useEffect(() => {
    document.title = 'ROS - Cashup';
    
    const subscription = cashupFacade.cashupList$.subscribe((cashupData: CashUp[]) => {
      const sortedData = [...cashupData].sort(
        (a, b) => new Date(b.cashUpDate).getTime() - new Date(a.cashUpDate).getTime()
      );
      setAllCashup(sortedData);
      setFilterCashup(cashupDataFilter(sortedData));
      console.log('Cashup List is updated', sortedData);
      setTotalDrafts(getTotalDrafts(sortedData));
      
      const deposits = cashupData.filter(
        (x) => x.cashUpStatus === 'PUBLISHED' && !(x.cashtotal === 0)
      );
      setAllDeposit(deposits);
      console.log('Deposit List is updated', deposits);
    });

    refreshBankingData();

    return () => {
      subscription.unsubscribe();
    };
  }, [cashupFacade]);

  const cashupDataFilter = (data: CashUp[] = allCashup): CashUp[] => {
    if (selectedCard === 'DRAFTS') {
      return data.filter(
        (x) => x.cashUpStatus === 'DRAFT' || x.cashUpStatus === 'IMPORT DRAFT'
      );
    }
    return data.filter(
      (x) =>
        x.cashUpStatus === 'DRAFT' ||
        x.cashUpStatus === 'IMPORT DRAFT' ||
        x.cashUpStatus === 'PUBLISHED'
    );
  };

  const handleSetSelectedCard = (s: string): void => {
    const newSelectedCard = selectedCard === s ? 'ALL' : s;
    setSelectedCard(newSelectedCard);
    console.log('Filtering', cashupDataFilter());
    setFilterCashup([...cashupDataFilter()]);
  };

  const resetDeposits = (s: string): void => {
    setDepositsFilter(s);
  };

  const addNew = (): void => {
    navigate('/accounting/cashup/new');
  };

  const filterbyDraft = (): void => {
    setFilterCashup(allCashup.filter((x) => x.cashUpStatus === 'DRAFT'));
  };

  const refreshBankingData = (): void => {
    cashupFacade.load();
  };

  const handleFilterByDateRange = (range: DateRange): void => {
    setRange({ ...range });
    cashupFacade.filterByDateRange(range);
  };

  const getTotalDrafts = (data: CashUp[] = allCashup): number => {
    return data.reduce((sum, x) => sum + x.cashtotal, 0);
  };

  const getTotalPendingdeposit = (): number => {
    return allDeposit.reduce(
      (sum, x) => sum + cashupFacade.getCashupTotals(x).cash,
      0
    );
  };

  const getTotalBanking = (): number => {
    return allBanking.reduce((sum: number, x: any) => sum + x.bankedTotal, 0);
  };

  const getTotalSummary = (): SummaryData => {
    const result: SummaryData = {
      yesterdayTotal: 0,
      todayTotal: 0,
      yesterdayPercent: 0,
      todayPercent: 0,
      showAddNew: true,
    };

    const todaySheets = allCashup.filter((x) =>
      isSameDay(new Date(x.cashUpDate), new Date())
    );
    const yesterdayDate = subDays(new Date(), 1);
    const yesterdaySheets = allCashup.filter((x) =>
      isSameDay(new Date(x.cashUpDate), yesterdayDate)
    );

    result.todayTotal = todaySheets.reduce(
      (sum, x) => sum + cashupFacade.getCashupTotals(x).cash,
      0
    );

    result.yesterdayTotal = yesterdaySheets.reduce(
      (sum, x) => sum + cashupFacade.getCashupTotals(x).cash,
      0
    );

    const dbYesterdayDate = subDays(new Date(), 2);
    const dbYesterdaySheets = allCashup.filter((x) =>
      isSameDay(new Date(x.cashUpDate), dbYesterdayDate)
    );

    const dbYesterdayTotal = dbYesterdaySheets.reduce(
      (sum, x) => sum + cashupFacade.getCashupTotals(x).cash,
      0
    );

    result.todayPercent =
      ((result.todayTotal - result.yesterdayTotal) / (result.todayTotal || 1)) * 100 || 0;
    result.yesterdayPercent =
      result.yesterdayTotal === 0
        ? -100
        : ((result.yesterdayTotal - dbYesterdayTotal) / (result.yesterdayTotal || 1)) * 100 || 0;

    result.showAddNew = todaySheets.length !== 2;

    return result;
  };

  const summary = getTotalSummary();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Cash Up</h1>
      
      {/* Filter Cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        {['DRAFTS', 'ALL', 'DEPOSITS', 'BANKED'].map((card) => (
          <div
            key={card}
            className={`w-[140px] h-[138px] rounded-xl shadow-md cursor-pointer flex flex-col p-4 ${
              selectedCard === card 
                ? 'bg-gray-100 bg-opacity-10 border-2 border-blue-500' 
                : 'bg-white'
            }`}
            onClick={() => handleSetSelectedCard(card)}
          >
            <h3 className="text-lg font-semibold text-gray-900">{card}</h3>
            <p className="text-2xl font-bold my-2">
              {card === 'DRAFTS' 
                ? totalDrafts 
                : card === 'DEPOSITS' 
                  ? getTotalPendingdeposit() 
                  : 'N/A'}
            </p>
            <div className="mt-auto">
              <div className="w-full bg-gray-200 rounded-full h-3.5">
                <div
                  className="bg-gray-800 h-3.5 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        {summary.showAddNew && (
          <button
            onClick={addNew}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Add New Cashup
          </button>
        )}
        <button
          onClick={() => resetDeposits('D')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
        >
          Daily Deposits
        </button>
        <button
          onClick={() => resetDeposits('M')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
        >
          Monthly Deposits
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Date Range</h3>
        <div className="flex gap-4">
          <input
            type="date"
            value={format(range.start_date, 'yyyy-MM-dd')}
            onChange={(e) => handleFilterByDateRange({
              ...range,
              start_date: e.target.valueAsDate || new Date(),
            })}
            className="border rounded p-2"
          />
          <input
            type="date"
            value={format(range.end_date, 'yyyy-MM-dd')}
            onChange={(e) => handleFilterByDateRange({
              ...range,
              end_date: e.target.valueAsDate || new Date(),
            })}
            className="border rounded p-2"
          />
        </div>
      </div>

      {/* Cashup Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filterCashup.map((cashup, index) => (
              <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(cashup.cashUpDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cashup.cashUpStatus === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-800'
                        : cashup.cashUpStatus === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {cashup.cashUpStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${cashupFacade.getCashupTotals(cashup).cash.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Today's Total</h3>
          <p className="text-2xl font-bold">${summary.todayTotal.toFixed(2)}</p>
          <p
            className={`text-sm ${
              summary.todayPercent >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {summary.todayPercent >= 0 ? '↑' : '↓'} {Math.abs(summary.todayPercent).toFixed(2)}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Yesterday's Total</h3>
          <p className="text-2xl font-bold">${summary.yesterdayTotal.toFixed(2)}</p>
          <p
            className={`text-sm ${
              summary.yesterdayPercent >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {summary.yesterdayPercent >= 0 ? '↑' : '↓'} {Math.abs(summary.yesterdayPercent).toFixed(2)}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Pending Deposits</h3>
          <p className="text-2xl font-bold">${getTotalPendingdeposit().toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CashUpComponent;