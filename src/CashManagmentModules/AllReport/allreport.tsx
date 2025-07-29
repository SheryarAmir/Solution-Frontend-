import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { format } from 'date-fns';

interface FacadeReport {
  id: string;
  ReportName: string;
  DATE: Date;
  FromDATE: Date;
  ToDATE: Date;
  UserName: string;
  // Add other properties as needed
}

const AllReportComponent: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<FacadeReport[]>([]);
  const [deleteObj, setDeleteObj] = useState<FacadeReport | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filterDuration, setFilterDuration] = useState('M');

  useEffect(() => {
    // Simulate loading reports
    const loadReports = async () => {
      try {
        // In a real app, you would call your API/service here
        // const reportsData = await reportFacade.load();
        // setReports(reportsData);
        
        // For demo purposes, setting dummy data
        const dummyReports: FacadeReport[] = [
          {
            id: '1',
            ReportName: 'PDQ Report February',
            DATE: new Date(2021, 1, 29),
            FromDATE: new Date(2021, 1, 1),
            ToDATE: new Date(2021, 1, 28),
            UserName: 'Krishna Kumar'
          },
          // Add more dummy reports as needed
        ];
        setReports(dummyReports);
      } catch (error) {
        console.error("Error loading reports:", error);
      }
    };

    loadReports();
  }, []);

  const resetFilter = (duration: string) => {
    setFilterDuration(duration);
  };

  const dateFormatter = (date: Date) => {
    return format(date, 'dd MMM yyyy');
  };

  const openDeleteDialog = (report: FacadeReport) => {
    setDeleteObj(report);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteObj(null);
  };

  const confirmDelete = () => {
    if (deleteObj) {
      setReports(reports.filter(x => x.id !== deleteObj.id));
    }
    closeDeleteDialog();
  };

  const gotoNewReport = () => {
    navigate("/accounting/report/new");
  };

  const columnDefs = [
    {
      field: "ReportName",
      headerName: "REPORT NAME",
      sortable: true,
    },
    {
      field: "DATE",
      headerName: "REPORT DATE",
      sortable: true,
      valueFormatter: (params: { data: FacadeReport }) => dateFormatter(params.data.DATE),
    },
    {
      field: "FromDATE",
      headerName: "FROM DATE",
      sortable: true,
      valueFormatter: (params: { data: FacadeReport }) => dateFormatter(params.data.FromDATE),
    },
    {
      field: "ToDATE",
      headerName: "TO DATE",
      sortable: true,
      valueFormatter: (params: { data: FacadeReport }) => dateFormatter(params.data.ToDATE),
    },
    {
      field: "UserName",
      headerName: "USER NAME",
      sortable: true,
    },
    {
      headerName: "ACTIONS",
      cellRenderer: (params: { data: FacadeReport }) => (
        <div className="flex space-x-2">
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ROS - Reports</h1>
        <button
          onClick={gotoNewReport}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          New Report
        </button>
      </div>

      {/* Duration Filter */}
      <div className="flex space-x-4 mb-6">
        <span
          className={`duration ${filterDuration === 'D' ? 'active' : ''}`}
          onClick={() => resetFilter('D')}
        >
          Daily
        </span>
        <span
          className={`duration ${filterDuration === 'W' ? 'active' : ''}`}
          onClick={() => resetFilter('W')}
        >
          Weekly
        </span>
        <span
          className={`duration ${filterDuration === 'M' ? 'active' : ''}`}
          onClick={() => resetFilter('M')}
        >
          Monthly
        </span>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columnDefs.map((col) => (
                  <th
                    key={col.field || 'actions'}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.ReportName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dateFormatter(report.DATE)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dateFormatter(report.FromDATE)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dateFormatter(report.ToDATE)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.UserName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => openDeleteDialog(report)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            <Dialog.Title className="text-lg font-bold mb-4">Delete Report</Dialog.Title>
            <Dialog.Description className="mb-4">
              Are you sure you want to delete this report?
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

export default AllReportComponent;