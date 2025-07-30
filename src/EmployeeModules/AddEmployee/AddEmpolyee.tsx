// AddEmployee.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaArrowLeft } from 'react-icons/fa';

interface FormValues {
  firstname: string;
  lastname: string;
  department: string;
  // Add rest of the fields as needed...
}

const AddEmployee: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const [empFormTab, setEmpFormTab] = useState('Basic');
  const [docDetails, setDocDetails] = useState([
    {
      docName: 'Passport',
      desp: 'Passport of employee',
      docType: 'contract',
      attachment: 'image_123.jpg'
    }
  ]);

  const gridRef = useRef<any>(null);

  const onSubmit = (data: FormValues) => {
    console.log('Form Data:', data);
    // Submit logic here
  };

  const onAddRow = () => {
    const docName = (document.getElementById('documentName') as HTMLInputElement).value;
    const fileInput = document.getElementById('file') as HTMLInputElement;
    let docAttach = fileInput.value.split('\\').pop();
    const docType = (document.getElementById('documentType') as HTMLSelectElement).value;
    const docDescription = (document.getElementById('documentDesp') as HTMLInputElement).value;

    const newDoc = {
      docName,
      desp: docDescription,
      docType: docType || 'Contract',
      attachment: docAttach || ''
    };

    setDocDetails(prev => [...prev, newDoc]);
  };

  const columnDefs = [
    { field: 'docName', headerName: 'DOCUMENT NAME', sortable: true, filter: true },
    { field: 'desp', headerName: 'DESCRIPTION', sortable: true, filter: true },
    { field: 'docType', headerName: 'DOCUMENT TYPE', sortable: true, filter: true },
    { field: 'attachment', headerName: 'ATTACHMENT', sortable: true, filter: true }
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 shadow-md h-screen p-4">
        <div className="pb-4 cursor-pointer" onClick={() => navigate(-1)}>
          <FaArrowLeft className="inline-block mr-2" /> Back
        </div>
        <div className="space-y-2">
          {['Basic', 'Bank', 'Documents'].map(tab => (
            <div
              key={tab}
              className={`p-4 cursor-pointer ${empFormTab === tab ? 'bg-gray-200 font-bold' : ''}`}
              onClick={() => setEmpFormTab(tab)}
            >
              {tab} Info
            </div>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          {empFormTab === 'Basic' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <input
                type="text"
                placeholder="First Name"
                {...register('firstname', { required: true })}
                className="border p-2 w-full"
              />
              {errors.firstname && <p className="text-red-500">First name is required</p>}

              <input
                type="text"
                placeholder="Last Name"
                {...register('lastname', { required: true })}
                className="border p-2 w-full"
              />
              {errors.lastname && <p className="text-red-500">Last name is required</p>}

              <input
                type="text"
                placeholder="Department"
                {...register('department', { required: true })}
                className="border p-2 w-full"
              />
              {errors.department && <p className="text-red-500">Department is required</p>}
            </div>
          )}

          {empFormTab === 'Documents' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Documents</h2>
              <div className="grid grid-cols-2 gap-4">
                <input id="documentName" type="text" placeholder="Document Name" className="border p-2" />
                <input id="documentDesp" type="text" placeholder="Description" className="border p-2" />
                <select id="documentType" className="border p-2">
                  <option value="contract">Contract</option>
                  <option value="id">ID</option>
                </select>
                <input id="file" type="file" className="border p-2" />
              </div>
              <button type="button" onClick={onAddRow} className="bg-blue-600 text-white px-4 py-2 rounded">
                Add Document
              </button>

              <div className="ag-theme-alpine mt-6" style={{ height: 200, width: '100%' }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={docDetails}
                  columnDefs={columnDefs}
                  domLayout="autoHeight"
                  defaultColDef={{ flex: 1, resizable: true }}
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
