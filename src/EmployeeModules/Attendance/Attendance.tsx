import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isSameDay } from 'date-fns';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface Attendance {
  attendance_date: Date;
  attendance_Details: {
    empAttendanceDetails: EmployeeAttendance[];
  };
}

interface EmployeeAttendance {
  empName: string;
  empImgUrl: string;
  id: string;
  department: string;
  status: string;
  [key: string]: any;
}

const AttendanceComponent: React.FC = () => {
  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact<EmployeeAttendance>>(null);
  const [view, setView] = useState<string>('D');
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [dispAttendance, setDispAttendance] = useState<EmployeeAttendance[]>([]);

  useEffect(() => {
    // Mock data - replace with your API call
    const mockData: Attendance[] = [
      {
        attendance_date: new Date(),
        attendance_Details: {
          empAttendanceDetails: [
            {
              empName: "John Doe",
              empImgUrl: "https://example.com/avatar.jpg",
              id: "EMP001",
              department: "Engineering",
              status: "On Duty"
            },
          ]
        }
      }
    ];
    setDispAttendance(mockData[0].attendance_Details.empAttendanceDetails);
  }, []);

  const viewCalendar = (employeeId: string) => {
    navigate(`/emp-management/employees/view-calendar/${employeeId}`);
  };

  const onGridReady = (params: GridReadyEvent<EmployeeAttendance>) => {
    params.api.sizeColumnsToFit();
  };

  const columnDefs: ColDef[] = [
    {
      field: "empName",
      headerName: "EMPLOYEE NAME",
      sortable: true,
      filter: true,
      checkboxSelection: true,
      cellRenderer: (params: { data: EmployeeAttendance }) => `
        <div class="flex items-center">
          <img src="${params.data.empImgUrl}" width="25" height="25" class="rounded-full mr-2"/>
          <span>${params.data.empName}</span>
        </div>
      `,
    },
    { field: "id", headerName: "EMP ID" },
    { field: "department", headerName: "DEPARTMENT" },
    {
      field: "status",
      headerName: "STATUS",
      cellStyle: (params) => ({
        color: params.value === "On Duty" 
          ? "rgba(70, 143, 73, 1)" 
          : params.value === "Off Duty" 
          ? "rgba(162, 70, 70, 1)" 
          : "rgba(236, 188, 15, 1)"
      }),
    },
    {
      headerName: "VIEW SCHEDULE",
      cellRenderer: (params: { data: EmployeeAttendance }) => (
        <button 
          onClick={() => viewCalendar(params.data.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          View
        </button>
      ),
    },
  ];

  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="w-[111px] h-[31px] bg-gray-800 shadow-md rounded text-white px-2"
        >
          <option value="D">Day</option>
          <option value="W">Week</option>
        </select>
      </div>

      <div className="ag-theme-alpine mt-3" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={dispAttendance}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          onGridReady={onGridReady}
          suppressCellFocus={true}
        />
      </div>
    </div>
  );
};

export default AttendanceComponent;