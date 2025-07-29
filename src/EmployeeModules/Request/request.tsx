import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { format, parseISO } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Request {
  id: number;
  empName: string;
  empImgUrl: string;
  department: string;
  Shift_date?: Date;
  Start_time?: string;
  End_Time?: string;
  Shift_status?: string;
  Start_date?: Date;
  End_date?: Date;
  Leave_status?: string;
  Profile_status?: string;
}

const RequestComponent: React.FC = () => {
  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact>(null);
  const [date] = useState<Date>(new Date());
  const [tab, setTab] = useState<string>('EMPLOYEES');
  const [selectedCard, setSelectedCard] = useState<string>('SHIFTS');
  const [allRequest, setAllRequest] = useState<Request[]>([]);
  const [event, setEvent] = useState<Request[]>([]);
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const [showApprove, setShowApprove] = useState<boolean>(true);
  const [showReject, setShowReject] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentModal, setCurrentModal] = useState<string>('');

  // Mock data - replace with your API calls
  useEffect(() => {
    const mockData: Request[] = [
      {
        id: 1,
        empName: 'John Doe',
        empImgUrl: 'https://example.com/avatar.jpg',
        department: 'Management',
        Shift_date: new Date(),
        Start_time: '09:00',
        End_Time: '17:00',
        Shift_status: 'Pending',
        Start_date: new Date(),
        End_date: new Date(),
        Leave_status: 'Approved',
        Profile_status: 'Active'
      },
      {
        id: 2,
        empName: 'Jane Smith',
        empImgUrl: 'https://example.com/avatar2.jpg',
        department: 'Engineering',
        Shift_date: new Date(),
        Start_time: '10:00',
        End_Time: '18:00',
        Shift_status: 'Approved',
        Start_date: new Date(),
        End_date: new Date(),
        Leave_status: 'Pending',
        Profile_status: 'Active'
      }
    ];
    setAllRequest(mockData);
    setEvent(mockData.filter(e => e.id === 2));
  }, []);

  const dateFormatter = (date: Date | undefined) => {
    if (!date) return '';
    return format(date, 'dd MMMM yyyy');
  };

  const timeFormatter = (time: string | undefined) => {
    if (!time) return '';
    return time;
  };

  const onGridReady = (params: GridReadyEvent) => {
    const columnApi = params.columnApi;
    const allColumnIds: string[] = [];
    
    columnApi.getColumns()?.forEach((column) => {
      if (column) {
        allColumnIds.push(column.getColId());
      }
    });
    
    columnApi.autoSizeColumns(allColumnIds, false);
    params.api.sizeColumnsToFit();
  };

  const Shift_columnDefs: ColDef[] = [
    {
      field: "empName",
      headerName: "EMPLOYEE NAME",
      sortable: true,
      filter: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      cellRenderer: (params: { data: Request }) => `
        <div class="flex items-center">
          <img src="${params.data.empImgUrl}" width="25" height="25" class="rounded-full mr-2"/>
          <span>${params.data.empName}</span>
        </div>
      `,
    },
    { field: "id", headerName: "EMP ID", sortable: true, filter: true },
    { field: "department", headerName: "DEPARTMENT", sortable: true, filter: true },
    {
      field: "Shift_date",
      headerName: "SHIFT DATE",
      sortable: true,
      filter: true,
      valueFormatter: (params) => dateFormatter(params.data.Shift_date),
    },
    {
      field: "Start_time",
      headerName: "START TIME",
      sortable: true,
      filter: true,
      valueFormatter: (params) => timeFormatter(params.data.Start_time),
    },
    {
      field: "End_Time",
      headerName: "END TIME",
      sortable: true,
      filter: true,
      valueFormatter: (params) => timeFormatter(params.data.End_Time),
    },
    {
      field: "Shift_status",
      headerName: "STATUS",
      sortable: true,
      filter: true,
    },
    {
      headerName: "ACTIONS",
      cellRenderer: (params: { data: Request }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => viewRequest(params.data.id, 'shift')}
            className="text-blue-500 hover:text-blue-700"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const Shift1_columnDefs: ColDef[] = [
    {
      headerName: "SR NO.",
      valueGetter: "node.rowIndex + 1",
    },
    {
      field: "Shift_date",
      headerName: "SHIFT DATE",
      sortable: true,
      filter: true,
      valueFormatter: (params) => dateFormatter(params.data.Shift_date),
    },
    {
      field: "Start_time",
      headerName: "START TIME",
      sortable: true,
      filter: true,
      valueFormatter: (params) => timeFormatter(params.data.Start_time),
    },
    {
      field: "End_Time",
      headerName: "END TIME",
      sortable: true,
      filter: true,
      valueFormatter: (params) => timeFormatter(params.data.End_Time),
    },
    {
      field: "Shift_status",
      headerName: "STATUS",
      sortable: true,
      filter: true,
    },
    {
      headerName: "ACTIONS",
      cellRenderer: (params: { data: Request }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => viewRequest(params.data.id, 'myshift')}
            className="text-blue-500 hover:text-blue-700"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const Leaves_columnDefs: ColDef[] = [
    {
      field: "empName",
      headerName: "EMPLOYEE NAME",
      sortable: true,
      filter: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      cellRenderer: (params: { data: Request }) => `
        <div class="flex items-center">
          <img src="${params.data.empImgUrl}" width="25" height="25" class="rounded-full mr-2"/>
          <span>${params.data.empName}</span>
        </div>
      `,
    },
    { field: "id", headerName: "EMP ID", sortable: true, filter: true },
    { field: "department", headerName: "DEPARTMENT", sortable: true, filter: true },
    {
      field: "Start_date",
      headerName: "START DATE",
      sortable: true,
      filter: true,
      valueFormatter: (params) => dateFormatter(params.data.Start_date),
    },
    {
      field: "End_date",
      headerName: "END DATE",
      sortable: true,
      filter: true,
      valueFormatter: (params) => dateFormatter(params.data.End_date),
    },
    {
      field: "Leave_status",
      headerName: "STATUS",
      sortable: true,
      filter: true,
    },
    {
      headerName: "ACTIONS",
      cellRenderer: (params: { data: Request }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => viewRequest(params.data.id, 'leave')}
            className="text-blue-500 hover:text-blue-700"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const Leaves1_columnDefs: ColDef[] = [
    {
      headerName: "SR NO.",
      valueGetter: "node.rowIndex + 1",
    },
    {
      field: "Start_date",
      headerName: "START DATE",
      sortable: true,
      filter: true,
      valueFormatter: (params) => dateFormatter(params.data.Start_date),
    },
    {
      field: "End_date",
      headerName: "END DATE",
      sortable: true,
      filter: true,
      valueFormatter: (params) => dateFormatter(params.data.End_date),
    },
    {
      field: "Leave_status",
      headerName: "STATUS",
      sortable: true,
      filter: true,
    },
    {
      headerName: "ACTIONS",
      cellRenderer: (params: { data: Request }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => viewRequest(params.data.id, 'myleave')}
            className="text-blue-500 hover:text-blue-700"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const Profile_columnDefs: ColDef[] = [
    {
      field: "empName",
      headerName: "EMPLOYEE NAME",
      sortable: true,
      filter: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      cellRenderer: (params: { data: Request }) => `
        <div class="flex items-center">
          <img src="${params.data.empImgUrl}" width="25" height="25" class="rounded-full mr-2"/>
          <span>${params.data.empName}</span>
        </div>
      `,
    },
    { field: "id", headerName: "EMP ID", sortable: true, filter: true },
    { field: "department", headerName: "DEPARTMENT", sortable: true, filter: true },
    {
      field: "Profile_status",
      headerName: "STATUS",
      sortable: true,
      filter: true,
    },
    {
      headerName: "ACTIONS",
      cellRenderer: (params: { data: Request }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => viewRequest(params.data.id, 'profile')}
            className="text-blue-500 hover:text-blue-700"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const Profile1_columnDefs: ColDef[] = [
    {
      headerName: "SR NO.",
      valueGetter: "node.rowIndex + 1",
    },
    { field: "department", headerName: "DEPARTMENT", sortable: true, filter: true },
    {
      field: "Profile_status",
      headerName: "STATUS",
      sortable: true,
      filter: true,
    },
    {
      headerName: "ACTIONS",
      cellRenderer: (params: { data: Request }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => viewRequest(params.data.id, 'myprofile')}
            className="text-blue-500 hover:text-blue-700"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  const viewRequest = (id: number, type: string) => {
    setCurrentModal(type);
    setIsModalOpen(true);
  };

  const setSelectedTab = (tab: string) => {
    setTab(tab);
    if (tab === 'MY REQUEST') {
      setSelectedCard('SHIFTS1');
    } else {
      setSelectedCard('SHIFTS');
    }
  };

  const ShowApproved = () => {
    setShowIcon(true);
    setShowReject(false);
  };

  const ShowRejected = () => {
    setShowIcon(true);
    setShowApprove(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModal('');
  };

  const renderModalContent = () => {
    switch (currentModal) {
      case 'shift':
        return (
          <div className="modal-body">
            <div className="flex justify-between mt-2">
              <h6 className="">
                <span onClick={closeModal} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-arrow-left arrow"></i> </span>
                &nbsp; <b> Update Shift Request </b> <br />
                <small className="ml-4">12 Dec 2020, Saturday</small>
              </h6>
              <div hidden={showIcon}>
                <i
                  className="fa fa-times fa-2x mr-4"
                  onClick={ShowApproved}
                  style={{ cursor: 'pointer', color: 'rgba(255, 0, 0, 0.801)' }}
                ></i>
                <i
                  className="fa fa-check fa-2x mr-4"
                  onClick={ShowRejected}
                  style={{ cursor: 'pointer', color: 'green' }}
                ></i>
              </div>
              <div hidden={showApprove} style={{ cursor: 'pointer', color: 'green' }}>
                APPROVED!
              </div>
              <div
                hidden={showReject}
                style={{ cursor: 'pointer', color: 'rgba(255, 0, 0, 0.801)' }}
              >
                REJECTED!
              </div>
            </div>
            <div className="row d-flex ml-3">
              <div className="col-12 mb-4">Location : London</div>
              <div className="col-12 mb-1">Employee Name : John Doe</div>
              <div className="col-12 mb-4">Department : Management</div>
              <div className="col-12 mb-4">Title : Head Chef</div>
              <div className="col-12 mb-4">Shift Type: Regular</div>
            </div>
            <div className="row d-flex ml-3 mb-5">
              <div className="col-6 mb-5">
                Shift Start Time <br />
                09:10
              </div>
              <div className="col-6 mb-5">
                Shift End Time <br />
                19:10
              </div>
            </div>
            <h6 className="ml-4">Edit Shift Time</h6>
            <div className="row d-flex ml-3 mb-3">
              <div className="col-6">
                Shift Start Time <br />
                10:10
              </div>
              <div className="col-6">
                Shift End Time <br />
                15:10
              </div>
            </div>
            <br />
            <div className="row d-flex ml-3">
              <h6 className="mt-2 ml-2">Approve</h6>
              <input type="checkbox" className="toggleSmall" />
            </div>
            <hr />
            <div className="row d-flex ml-1">
              <div className="col-5">
                <h6>Send Changes</h6>
              </div>
              <div className="col-3">
                <input type="checkbox" className="mr-2" /> Send SMS
              </div>
              <div className="col-3">
                <input type="checkbox" className="mr-2" /> Send Message
              </div>
            </div>
            <div className="row d-flex ml-1">
              <div className="col-12">
                <small>
                  <i className="fa fa-info-circle fa-xs" aria-hidden="true"></i> if
                  changing shift from one employee to another, both employees will
                  notify
                </small>
              </div>
            </div>
          </div>
        );
      // Add cases for other modal types (leave, profile, etc.)
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="row">
        {/* Request heading and tab */}
        <div className="col-12 col-md-6 mb-2">
          <h4>Requests</h4>

          <div className="flex border rounded-lg overflow-hidden w-max">
            <button
              className={`px-4 py-2 ${tab === 'EMPLOYEES' ? 'bg-black text-white' : 'bg-white'}`}
              onClick={() => setSelectedTab('EMPLOYEES')}
            >
              EMPLOYEES
            </button>
            <button
              className={`px-4 py-2 ${tab === 'MY REQUEST' ? 'bg-black text-white' : 'bg-white'}`}
              onClick={() => setSelectedTab('MY REQUEST')}
            >
              MY REQUEST
            </button>
          </div>
        </div>

        {/* shifts, leaves and profile cards */}
        <div className="col-12 col-md-6 mb-1 flex justify-between">
          {tab === 'EMPLOYEES' ? (
            <>
              <div
                className={`box p-4 m-2 cursor-pointer ${selectedCard === 'SHIFTS' ? 'bg-gray-100 shadow-inner' : 'bg-white shadow-md'}`}
                onClick={() => setSelectedCard('SHIFTS')}
              >
                SHIFTS
                <span className="absolute top-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform translate-x-1/2 -translate-y-1/2">
                  {allRequest.length}
                </span>
              </div>
              <div
                className={`box p-4 m-2 cursor-pointer ${selectedCard === 'LEAVES' ? 'bg-gray-100 shadow-inner' : 'bg-white shadow-md'}`}
                onClick={() => setSelectedCard('LEAVES')}
              >
                LEAVES
                <span className="absolute top-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform translate-x-1/2 -translate-y-1/2">
                  {allRequest.length}
                </span>
              </div>
              <div
                className={`box p-4 m-2 cursor-pointer ${selectedCard === 'PROFILE' ? 'bg-gray-100 shadow-inner' : 'bg-white shadow-md'}`}
                onClick={() => setSelectedCard('PROFILE')}
              >
                PROFILE
                <span className="absolute top-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform translate-x-1/2 -translate-y-1/2">
                  {allRequest.length}
                </span>
              </div>
            </>
          ) : (
            <>
              <div
                className={`box p-4 m-2 cursor-pointer ${selectedCard === 'SHIFTS1' ? 'bg-gray-100 shadow-inner' : 'bg-white shadow-md'}`}
                onClick={() => setSelectedCard('SHIFTS1')}
              >
                SHIFTS
                <span className="absolute top-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform translate-x-1/2 -translate-y-1/2">
                  {event.length}
                </span>
              </div>
              <div
                className={`box p-4 m-2 cursor-pointer ${selectedCard === 'LEAVES1' ? 'bg-gray-100 shadow-inner' : 'bg-white shadow-md'}`}
                onClick={() => setSelectedCard('LEAVES1')}
              >
                LEAVES
                <span className="absolute top-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform translate-x-1/2 -translate-y-1/2">
                  {event.length}
                </span>
              </div>
              <div
                className={`box p-4 m-2 cursor-pointer ${selectedCard === 'PROFILE1' ? 'bg-gray-100 shadow-inner' : 'bg-white shadow-md'}`}
                onClick={() => setSelectedCard('PROFILE1')}
              >
                PROFILE
                <span className="absolute top-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform translate-x-1/2 -translate-y-1/2">
                  {event.length}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {tab === 'EMPLOYEES' && (
        <div className="row mb-2 justify-end">
          <button className="btn btn-sm btn-outline-danger px-3 mr-3 text-red-600 border-red-600">
            <i className="fa fa-times mr-2"></i> REJECT
          </button>

          <button className="btn btn-sm btn-outline-success px-2 mr-3 text-green-600 border-green-600">
            <i className="fa fa-check mr-1"></i> APPROVE
          </button>
        </div>
      )}

      <div className="row">
        {selectedCard === 'SHIFTS' && (
          <div className="ag-theme-alpine w-full" style={{ height: 500 }}>
            <AgGridReact
              ref={gridRef}
              rowData={allRequest}
              columnDefs={Shift_columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              onGridReady={onGridReady}
              suppressCellFocus={true}
            />
          </div>
        )}
        {selectedCard === 'LEAVES' && (
          <div className="ag-theme-alpine w-full" style={{ height: 500 }}>
            <AgGridReact
              ref={gridRef}
              rowData={allRequest}
              columnDefs={Leaves_columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              onGridReady={onGridReady}
              suppressCellFocus={true}
            />
          </div>
        )}
        {selectedCard === 'PROFILE' && (
          <div className="ag-theme-alpine w-full" style={{ height: 500 }}>
            <AgGridReact
              ref={gridRef}
              rowData={allRequest}
              columnDefs={Profile_columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              onGridReady={onGridReady}
              suppressCellFocus={true}
            />
          </div>
        )}
        {selectedCard === 'SHIFTS1' && (
          <div className="ag-theme-alpine w-full" style={{ height: 500 }}>
            <AgGridReact
              ref={gridRef}
              rowData={event}
              columnDefs={Shift1_columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              onGridReady={onGridReady}
              suppressCellFocus={true}
            />
          </div>
        )}
        {selectedCard === 'LEAVES1' && (
          <div className="ag-theme-alpine w-full" style={{ height: 500 }}>
            <AgGridReact
              ref={gridRef}
              rowData={event}
              columnDefs={Leaves1_columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              onGridReady={onGridReady}
              suppressCellFocus={true}
            />
          </div>
        )}
        {selectedCard === 'PROFILE1' && (
          <div className="ag-theme-alpine w-full" style={{ height: 500 }}>
            <AgGridReact
              ref={gridRef}
              rowData={event}
              columnDefs={Profile1_columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              onGridReady={onGridReady}
              suppressCellFocus={true}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {renderModalContent()}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default RequestComponent;