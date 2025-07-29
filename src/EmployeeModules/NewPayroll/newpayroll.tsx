.

import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Employee } from '../../model/employee.model';
import { Modal, Checkbox, Select, Input, Button } from '@/components/ui'; // Assume custom UI components
import { useEmployeeStore } from '@/store/employeeStore'; // A Zustand or context store for employee data
import { FaTrash, FaSave, FaPlus, FaTimes, FaSearch } from 'react-icons/fa';

interface ChecklistItem {
  id: number;
  value: string;
  isSelected: boolean;
}

const NewPayrollComponent: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 1, value: 'Shift Type', isSelected: true },
    { id: 2, value: 'Date', isSelected: true },
    { id: 3, value: 'Location', isSelected: false },
    { id: 4, value: 'Start Time', isSelected: false },
    { id: 5, value: 'End Time', isSelected: false },
    { id: 6, value: 'Break', isSelected: false },
    { id: 7, value: 'Approved', isSelected: false },
  ]);

  const [isShow, setIsShow] = useState(false);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string[]>([]);
  const [rowData, setRowData] = useState<Employee[]>([]);
  const [filteredData, setFilteredData] = useState<Employee[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [saveReportOpen, setSaveReportOpen] = useState(false);
  const [reportName, setReportName] = useState('');

  const allEmployees = useEmployeeStore((state) => state.employeeList);
  const loadEmployees = useEmployeeStore((state) => state.load);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    setRowData(allEmployees);
    setFilteredData(allEmployees);
  }, [allEmployees]);

  useEffect(() => {
    filterEmployee();
  }, [searchEmployee, selectedDepartment]);

  const filterEmployee = () => {
    const lowerSearch = searchEmployee.toLowerCase();
    let result = rowData.filter(
      (x) =>
        x.id === searchEmployee ||
        x.empName.toLowerCase().includes(lowerSearch)
    );

    if (!selectedDepartment.includes('all') && selectedDepartment.length > 0) {
      result = result.filter((x) => selectedDepartment.includes(x.department));
    }
    setFilteredData(result);
  };

  const columnDefs = [
    {
      field: 'empName',
      headerName: 'EMPLOYEE NAME',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <img
            src={params.data.empImgUrl}
            alt="emp"
            className="w-6 h-6 rounded-full"
          />
          {params.data.empName}
        </div>
      ),
    },
    { field: 'id', headerName: 'EMP ID' },
    { field: 'department', headerName: 'DEPARTMENT' },
    {
      field: 'DELETE',
      cellRenderer: (params: any) => (
        <button
          onClick={() => handleDelete(params.data)}
          className="text-red-600 hover:text-red-800"
        >
          <FaTrash />
        </button>
      ),
    },
  ];

  const handleDelete = (employee: Employee) => {
    // trigger confirmation modal then delete logic
    console.log('Delete:', employee);
  };

  const handleSaveReport = () => {
    console.log('Report saved:', reportName);
    setSaveReportOpen(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Payroll Reports</h2>
        <div className="flex gap-2">
          <Button onClick={() => setModalOpen(true)}>
            <FaPlus className="mr-1" /> Add Fields
          </Button>
          <Button onClick={() => setSaveReportOpen(true)}>
            <FaSave className="mr-1" /> Save Report
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Employee Name or ID"
          value={searchEmployee}
          onChange={(e) => setSearchEmployee(e.target.value)}
        />
        <Select
          multiple
          placeholder="Select Department"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          options={['BOH', 'FOH', 'Management', 'all']}
        />
      </div>

      {isShow && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <div className="text-center font-semibold">Basic Info</div>
            <div className="text-center text-xl">
              {checklist.filter((c) => c.isSelected).length}
            </div>
          </div>
          {/* Add other cards for bank and shifts similarly */}
        </div>
      )}

      <div className="ag-theme-alpine w-full h-[500px]">
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          onGridReady={(params) => setGridApi(params.api)}
        />
      </div>

      {/* Modal: Add Fields */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-lg font-semibold mb-4">Select Fields For Payroll Report</h3>
        <div className="grid grid-cols-2 gap-2">
          {checklist.map((item) => (
            <label key={item.id} className="flex items-center gap-2">
              <Checkbox
                checked={item.isSelected}
                onChange={() => {
                  const updated = checklist.map((c) =>
                    c.id === item.id ? { ...c, isSelected: !c.isSelected } : c
                  );
                  setChecklist(updated);
                }}
              />
              {item.value}
            </label>
          ))}
        </div>
        <Button onClick={() => { setIsShow(true); setModalOpen(false); }} className="mt-4">
          <FaPlus className="mr-1" /> Add
        </Button>
      </Modal>

      {/* Modal: Save Report */}
      <Modal open={saveReportOpen} onClose={() => setSaveReportOpen(false)}>
        <h3 className="text-lg font-semibold mb-2">Name Your Report</h3>
        <Input
          placeholder="BOH - Payroll (March)"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
        />
        <Button onClick={handleSaveReport} className="mt-4">
          <FaSave className="mr-1" /> Save Report
        </Button>
      </Modal>
    </div>
  );
};

export default NewPayrollComponent;
