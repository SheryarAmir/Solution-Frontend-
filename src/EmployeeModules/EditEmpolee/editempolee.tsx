import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

type Shift = {
  Shift_date: string;
  location: string;
  startTime: string;
  endTime: string;
  break: string;
  approved: string;
};

type Document = {
  docName: string;
  desp: string;
  docType: string;
  attachment: string;
};

const employeeFormSchema = z.object({
  firstname: z.string().min(1, "Required"),
  lastname: z.string().min(1, "Required"),
  mobilenumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile"),
  email: z.string().email().optional(),
  department: z.string().min(1, "Required"),
  salary: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  empstatement: z.string().optional(),
});

type EmployeeForm = z.infer<typeof employeeFormSchema>;

export default function EditEmployee() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shiftDetails, setShiftDetails] = useState<Shift[]>([]);
  const [docDetails, setDocDetails] = useState<Document[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeFormSchema),
  });

  useEffect(() => {
    // Simulated employee fetch
    const employee = {
      firstname: "John",
      lastname: "Doe",
      mobilenumber: "9876543210",
      email: "john@example.com",
      department: "Engineering",
      salary: "50000",
      location: "NYC",
      empstatement: "Statement 1",
    };
    reset(employee);

    setShiftDetails([
      {
        Shift_date: "01 March 2021",
        location: "Cremes Cafe",
        startTime: "09:00",
        endTime: "15:00",
        break: "00:45",
        approved: "Not approved",
      },
    ]);

    setDocDetails([
      {
        docName: "Passport",
        desp: "Passport of employee",
        docType: "contract",
        attachment: "image_123.jpg",
      },
    ]);
  }, [reset]);

  const onSubmit = (data: EmployeeForm) => {
    console.log("Submitted", data);
    setShowPopup(true);
  };

  return (
    <div className="flex h-screen">
      <aside className="w-60 bg-gray-100 p-4 shadow-lg">
        <button
          className="text-blue-500 mb-4"
          onClick={() => navigate("/employees/all")}
        >
          ← Back
        </button>
        <ul className="space-y-4">
          {["Basic", "Bank", "Documents", "Shifts"].map((tab) => (
            <li key={tab} className="cursor-pointer hover:text-blue-600">
              {tab}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Edit Employee</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="First Name"
              {...register("firstname")}
              className="border p-2 rounded"
            />
            <input
              placeholder="Last Name"
              {...register("lastname")}
              className="border p-2 rounded"
            />
            <input
              placeholder="Mobile Number"
              {...register("mobilenumber")}
              className="border p-2 rounded"
            />
            <input
              placeholder="Email"
              {...register("email")}
              className="border p-2 rounded"
            />
            <input
              placeholder="Department"
              {...register("department")}
              className="border p-2 rounded"
            />
            <input
              placeholder="Salary"
              {...register("salary")}
              className="border p-2 rounded"
            />
            <input
              placeholder="Location"
              {...register("location")}
              className="border p-2 rounded"
            />
            <input
              placeholder="Employee Statement"
              {...register("empstatement")}
              className="border p-2 rounded"
            />
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="text-red-500">
              {Object.entries(errors).map(([key, error]) => (
                <p key={key}>{error.message}</p>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Save
            </button>
          </div>
        </form>

        <h2 className="text-xl font-semibold mt-10 mb-4">Shift Details</h2>
        <table className="table-auto w-full border mb-10">
          <thead className="bg-gray-200">
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th>Start</th>
              <th>End</th>
              <th>Break</th>
              <th>Approved</th>
            </tr>
          </thead>
          <tbody>
            {shiftDetails.map((shift, idx) => (
              <tr key={idx} className="text-center border-t">
                <td>{shift.Shift_date}</td>
                <td>{shift.location}</td>
                <td>{shift.startTime}</td>
                <td>{shift.endTime}</td>
                <td>{shift.break}</td>
                <td>{shift.approved}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-xl font-semibold mb-4">Document Details</h2>
        <table className="table-auto w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th>Document Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>Attachment</th>
            </tr>
          </thead>
          <tbody>
            {docDetails.map((doc, idx) => (
              <tr key={idx} className="text-center border-t">
                <td>{doc.docName}</td>
                <td>{doc.desp}</td>
                <td>{doc.docType}</td>
                <td>{doc.attachment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {/* Simple modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Saved Successfully</h2>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
