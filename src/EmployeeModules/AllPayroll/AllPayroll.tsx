import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaDownload, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import PayrollActionCellRenderer from "../PayrollActionCellRenderer/PayrollActionCellRenderer";

interface Payroll {
  id: string;
  Report_Name: string;
  Start_date: string;
  End_date: string;
  // Add other fields if needed
}

const AllPayroll: React.FC = () => {
  const [allPayroll, setAllPayroll] = useState<Payroll[]>([]);
  const [downloadOptions, setDownloadOptions] = useState(false);
  const gridApi = useRef<any>(null);
  const gridColumnApi = useRef<any>(null);
  const navigate = useNavigate();

  // Dummy data loading simulation
  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = () => {
    // Replace with actual API call
    const dummyData: Payroll[] = [
      {
        id: "1",
        Report_Name: "Payroll July",
        Start_date: "2025-07-01",
        End_date: "2025-07-31",
      },
      {
        id: "2",
        Report_Name: "Payroll June",
        Start_date: "2025-06-01",
        End_date: "2025-06-30",
      },
    ];
    setAllPayroll(dummyData);
  };

  const onGridReady = (params: any) => {
    gridApi.current = params.api;
    gridColumnApi.current = params.columnApi;

    const allColumnIds: string[] = [];
    gridColumnApi.current.getAllColumns().forEach((col: any) => {
      allColumnIds.push(col.colId);
    });
    gridColumnApi.current.autoSizeColumns(allColumnIds, false);
    gridApi.current.sizeColumnsToFit();
    gridApi.current.resetRowHeights();
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB");

  const downloadCSV = () => {
    // Replace with actual CSV download logic
    console.log("Downloading CSV", allPayroll);
  };

  const downloadExcel = () => {
    // Replace with actual Excel download logic
    console.log("Downloading Excel", allPayroll);
  };

  const columnDefs = [
    {
      field: "Report_Name",
      headerName: "REPORT NAME",
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      field: "Start_date",
      headerName: "START DATE",
      valueFormatter: (params: any) => formatDate(params.value),
    },
    {
      field: "End_date",
      headerName: "END DATE",
      valueFormatter: (params: any) => formatDate(params.value),
    },
    {
      field: "DOWNLOAD",
      cellRenderer: "payrollActionCellRenderer",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold">Payroll Report</h4>
        <div>{/* Replace with custom date range picker if needed */}</div>
      </div>

      {/* Download / Create New Buttons */}
      <div className="flex justify-end mb-4 space-x-2">
        {downloadOptions && (
          <div className="flex space-x-2">
            <button
              onClick={downloadCSV}
              className="bg-gray-800 text-white text-sm px-3 py-1 rounded"
            >
              CSV
            </button>
            <button
              onClick={downloadExcel}
              className="bg-gray-800 text-white text-sm px-3 py-1 rounded"
            >
              EXCEL
            </button>
          </div>
        )}
        <button
          onMouseEnter={() => setDownloadOptions(true)}
          onClick={() => setDownloadOptions((prev) => !prev)}
          className="bg-gray-800 text-white text-sm px-3 py-1 rounded flex items-center gap-2"
        >
          <FaDownload /> Download
        </button>
        <button
          onClick={() => navigate("/ROS/emp-management/payroll/new-payroll")}
          className="bg-gray-800 text-white text-sm px-3 py-1 rounded flex items-center gap-2"
        >
          <FaPlus /> Create New
        </button>
      </div>

      {/* AG Grid */}
      <div className="ag-theme-alpine w-full" style={{ height: "500px" }}>
        <AgGridReact
          rowData={allPayroll}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            resizable: true,
            sortable: true,
            filter: true,
          }}
          pagination={true}
          paginationPageSize={10}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          frameworkComponents={{
            payrollActionCellRenderer: PayrollActionCellRenderer,
          }}
          context={{
            componentParent: {
              download: (id: string) => {
                console.log("Download payroll for ID:", id);
              },
            },
          }}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default AllPayroll;
