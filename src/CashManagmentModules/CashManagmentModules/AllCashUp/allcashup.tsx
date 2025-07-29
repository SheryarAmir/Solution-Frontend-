import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { format } from 'date-fns';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface CashUp {
  id: string;
  cashUpDate: Date;
  cashUpTimeIndicator: string;
  epostotal: number;
  cashtotal: number;
  pdqtotal: number;
  deliverytotal: number;
  difference: number;
  kpitotal: number;
  cashUpStatus: string;
  sales: Array<{
    foodPayment: number;
    drinksPayment: number;
    takeAwayPayment: number;
    otherPayment: number;
    taxInfo: Array<{ name: string; amount: number }>;
    creditCardTip: number;
    serviceCharges: number;
  }>;
  cashnPdq: {
    pettyCashs: Array<{ pettyCashName: string; amount: number }>;
    tillSystems: Array<{ name: string; amount: number }>;
    pdqSystems: Array<{ name: string; cardName: string; amount: number }>;
    wageAdvances: Array<{ amount: number }>;
  };
  thirdPartyInfo: Array<{ name: string; amount: number }>;
  kpi: {
    kpiCovers: Array<{ kpiName: string; amount: number }>;
    breakDownDetails: Array<{ name: string; amount: number }>;
  };
  safeSummary: {
    safeCount: number;
    safeTillAmount: number;
    bankedAmount: number;
  };
  reason: string;
  reasonAddedBy: string;
}

const AllCashupComponent: React.FC = () => {
  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact>(null);
  const [allCashup, setAllCashup] = useState<CashUp[]>([]);
  const [deleteCashupObj, setDeleteCashupObj] = useState<CashUp | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cashupsDownObj, setCashupsDownObj] = useState<any[]>([]);
  const [currSym, setCurrSym] = useState<string>('£');
  const [dateRange, setDateRange] = useState({
    start_date: new Date(),
    end_date: new Date(),
  });

  // Initialize grid
  const gridOptions = {
    rowSelection: 'multiple',
  };

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
  };

  const currencyFormatter = (value: number, currencySymbol: string) => {
    return `${currencySymbol} ${value.toFixed(2)}`;
  };

  const currencyFormatterWithColor = (value: number, currencySymbol: string) => {
    if (value < 0) return { color: '#A24646', value: `${currencySymbol} ${Math.abs(value).toFixed(2)}` };
    if (value === 0) return { color: '#000000', value: `${currencySymbol} ${value.toFixed(2)}` };
    return { color: '#468F49', value: `${currencySymbol} ${value.toFixed(2)}` };
  };

  const dateFormatter = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  const columnDefs = [
    {
      field: 'cashUpDate',
      headerName: 'DATE',
      filter: 'agDateColumnFilter',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      valueFormatter: (params: any) => dateFormatter(params.data.cashUpDate),
    },
    {
      field: 'cashUpTimeIndicator',
      headerName: 'TIME',
    },
    {
      field: 'epostotal',
      headerName: 'EPOS',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params: any) => currencyFormatter(params.data.epostotal, currSym),
    },
    {
      field: 'cashtotal',
      headerName: 'CASH',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params: any) => currencyFormatter(params.data.cashtotal, currSym),
    },
    {
      field: 'pdqtotal',
      headerName: 'PDQ',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params: any) => currencyFormatter(params.data.pdqtotal, currSym),
    },
    {
      field: 'deliverytotal',
      headerName: 'DELIVERY',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params: any) => currencyFormatter(params.data.deliverytotal, currSym),
    },
    {
      field: 'difference',
      headerName: 'DIFFERENCE',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params: any) => currencyFormatterWithColor(params.data.difference, currSym).value,
      cellStyle: (params: any) => {
        const style = currencyFormatterWithColor(params.value, currSym);
        return { color: style.color };
      },
    },
    {
      field: 'kpitotal',
      headerName: 'KPI TOTAL',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params: any) => currencyFormatter(params.data.kpitotal, currSym),
    },
    {
      field: 'cashUpStatus',
      headerName: 'STATUS',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'ACTIONS',
      cellRenderer: (params: any) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => viewCashup(params.data)}
            className="text-blue-500 hover:text-blue-700"
          >
            View
          </button>
          <button 
            onClick={() => editCashup(params.data)}
            className="text-green-500 hover:text-green-700"
          >
            Edit
          </button>
          <button 
            onClick={() => openDeleteDialog(params.data)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Simulate loading cashup data
    const loadCashupData = async () => {
      try {
        // In a real app, you would call your API/service here
        // const cashupData = await cashupFacade.load();
        // setAllCashup(cashupData.filter(x => x.cashUpStatus === "DRAFT" || x.cashUpStatus === "PUBLISHED"));
        
        // For demo purposes, setting dummy data
        const dummyData: CashUp[] = [
          // Add your dummy data here
        ];
        setAllCashup(dummyData);
        setCurrSym('£'); // Set from configurations in a real app
      } catch (error) {
        console.error("Error loading cashup data:", error);
      }
    };

    loadCashupData();
  }, []);

  const onGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  const formatDownloadData = () => {
    if (!gridRef.current) return;
    
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    
    if (selectedData.length === 0) {
      alert("Please make selection before download");
      return;
    }

    const formattedData = selectedData.map((x, index) => {
      const cashupObj: any = {};
      // Format data as per the original implementation
      // ... (same formatting logic as in the Angular component)
      return cashupObj;
    });

    setCashupsDownObj(formattedData);
    return formattedData;
  };

  const editCashup = (cashup: CashUp) => {
    navigate("/accounting/cashup/edit", { state: cashup });
  };

  const viewCashup = (cashup: CashUp) => {
    navigate("/accounting/cashup/view", { state: cashup });
  };

  const filterCashData = (status: string) => {
    // In a real app, you would filter from the original data source
    // This is just a simple filter for demo purposes
    const filtered = allCashup.filter(x => x.cashUpStatus === status);
    setAllCashup(filtered);
  };

  const openDeleteDialog = (cashup: CashUp) => {
    setDeleteCashupObj(cashup);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteCashupObj(null);
  };

  const confirmDelete = () => {
    if (deleteCashupObj) {
      // In a real app, you would call your API/service here
      // await cashupFacade.deleteCashup(deleteCashupObj.id);
      setAllCashup(allCashup.filter(x => x.id !== deleteCashupObj.id));
    }
    closeDeleteDialog();
  };

  const downloadEXCEL = () => {
    const data = formatDownloadData();
    if (data && data.length > 0) {
      // Implement your Excel download logic here
      console.log("Downloading Excel:", data);
    }
  };

  const downloadCSV = () => {
    const data = formatDownloadData();
    if (data && data.length > 0) {
      // Implement your CSV download logic here
      console.log("Downloading CSV:", data);
    }
  };

  const navigateToAddNew = () => {
    navigate("/accounting/cashup");
  };

  const filterByDateRange = (range: { start_date: Date; end_date: Date }) => {
    // Implement date range filtering
    setDateRange(range);
    // In a real app, you would call your API/service here
    // cashupFacade.filterByDateRange(range);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cashup Management</h1>
        <button
          onClick={navigateToAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Cashup
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => filterCashData('DRAFT')}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Draft
        </button>
        <button
          onClick={() => filterCashData('PUBLISHED')}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Published
        </button>
        {/* Add more filter buttons as needed */}
      </div>

      {/* Download Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={downloadEXCEL}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Download Excel
        </button>
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Download CSV
        </button>
      </div>

      {/* AG Grid Table */}
      <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={allCashup}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          animateRows={true}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="bg-white rounded-lg max-w-md mx-auto p-6 z-20">
            <Dialog.Title className="text-lg font-bold mb-4">Delete Cashup</Dialog.Title>
            <Dialog.Description className="mb-4">
              Are you sure you want to delete this cashup?
            </Dialog.Description>

            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AllCashupComponent;