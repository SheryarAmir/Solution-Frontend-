"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import {
  Pencil,
  Save,
  Plus,
  X,
  Download,
  Trash2,
  User,
  Calendar,
  Banknote,
  FileText,
  ClipboardList,
  DollarSign,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- Data Interfaces (simulating your Angular models) ---
interface BasicInfo {
  joiningInfo: {
    joiningDate: string
  }
  empDetails: {
    empImgUrl: string
    firstName: string
    middleName: string
    lastName: string
    addr: string
    zip: string
    city: string
    state: string
    country: string
    email: string
    mobile: string
    telephone: string
  }
  deptDetails: {
    department: string
    position: string
  }
  kinInfo: {
    firstName: string
    middleName: string
    lastName: string
    addr: string
    zip: string
    email: string
    mobile: string
    telephone: string
    relation: string
  }
}

interface BankDetails {
  BankInfo: {
    BankName: string
    BranchAcc: string
    AccHolderName: string
    BranchSortCode: string
    AccNumber: string
  }
  salaryInfo: {
    EmployeeType: string
    Salary: string
  }
}

interface StatutoryInfo {
  BankInfo: {
    Nationality: string
    PlaceofBirth: string
    DateofBirth: string
    Gender: string
    Age: string
    MaritalStatus: string
    PassportNumber: string
  }
  NInumber: {
    NInumber: string
  }
  Tax: {
    HavingtaxP45: boolean
  }
}

interface StatementsInfo {
  EmployeeStatement: {
    Statement: "Statement1" | "Statement2" | "Statement3"
  }
  studentLoan: {
    studentLoan: "Yes" | "No"
  }
  medicalCondition: {
    MedicalCondition: string
  }
}

interface EmployeeProfileData {
  id: number
  basicInfo: BasicInfo
  bankDetails: BankDetails
  StatutoryInfo: StatutoryInfo
  StatmentsInfo: StatementsInfo
}

interface ShiftDetail {
  Shift_date: string
  location: string
  startTime: string
  endTime: string
  break: string
  approved: string
}

interface DocumentDetail {
  docName: string
  desp: string
  docType: string
  attachment: string
}

// --- Mock Data (replace with actual API calls in a real app) ---
const mockEmployeeData: EmployeeProfileData[] = [
  {
    id: 0, // Simulating the empid = 0
    basicInfo: {
      joiningInfo: {
        joiningDate: "2020-01-15T00:00:00.000Z",
      },
      empDetails: {
        empImgUrl: "/placeholder.svg?height=150&width=150",
        firstName: "John",
        middleName: "A.",
        lastName: "Doe",
        addr: "123 Main St",
        zip: "10001",
        city: "New York",
        state: "NY",
        country: "USA",
        email: "john.doe@example.com",
        mobile: "123-456-7890",
        telephone: "987-654-3210",
      },
      deptDetails: {
        department: "Management",
        position: "Manager",
      },
      kinInfo: {
        firstName: "Jane",
        middleName: "",
        lastName: "Doe",
        addr: "123 Main St",
        zip: "10001",
        email: "jane.doe@example.com",
        mobile: "111-222-3333",
        telephone: "444-555-6666",
        relation: "Spouse",
      },
    },
    bankDetails: {
      BankInfo: {
        BankName: "First National Bank",
        BranchAcc: "Main Branch",
        AccHolderName: "John A. Doe",
        BranchSortCode: "12-34-56",
        AccNumber: "12345678",
      },
      salaryInfo: {
        EmployeeType: "Full-time",
        Salary: "Monthly",
      },
    },
    StatutoryInfo: {
      BankInfo: {
        Nationality: "American",
        PlaceofBirth: "New York",
        DateofBirth: "1990-05-20T00:00:00.000Z",
        Gender: "Male",
        Age: "34",
        MaritalStatus: "Married",
        PassportNumber: "P1234567",
      },
      NInumber: {
        NInumber: "AB123456C",
      },
      Tax: {
        HavingtaxP45: true,
      },
    },
    StatmentsInfo: {
      EmployeeStatement: {
        Statement: "Statement1",
      },
      studentLoan: {
        studentLoan: "No",
      },
      medicalCondition: {
        MedicalCondition: "None",
      },
    },
  },
  // Add more mock employee data if needed for other IDs
]

const ShiftDetails: ShiftDetail[] = [
  {
    Shift_date: "01 March 2021",
    location: "Cremes Cafe",
    startTime: "09:00",
    endTime: "15:00",
    break: "00:45",
    approved: "Not approved",
  },
  {
    Shift_date: "02 March 2021",
    location: "Cremes Cafe",
    startTime: "09:00",
    endTime: "15:00",
    break: "00:45",
    approved: "Approved",
  },
  {
    Shift_date: "03 March 2021",
    location: "Cremes Cafe",
    startTime: "09:00",
    endTime: "15:00",
    break: "00:45",
    approved: "Not approved",
  },
  {
    Shift_date: "04 March 2021",
    location: "Cremes Cafe",
    startTime: "09:00",
    endTime: "15:00",
    break: "00:45",
    approved: "Approved",
  },
]

const DocDetails: DocumentDetail[] = [
  {
    docName: "Passport",
    desp: "Passport of employee",
    docType: "contract",
    attachment: "image_123.jpg",
  },
  {
    docName: "Driving License",
    desp: "Driving license of employee",
    docType: "ID",
    attachment: "license.pdf",
  },
]

const EmpProfileComponent: React.FC = () => {
  const [empFormTab, setEmpFormTab] = useState<string>("Basic")
  const [empid] = useState<number>(0) // Simulating employee ID 0
  const [empobj, setEmpobj] = useState<EmployeeProfileData | null>(null)

  // Accounting tab states
  const [tillName, setTillName] = useState<string>("")
  const [tills, setTills] = useState<string[]>([])
  const [pdqName, setPdqName] = useState<string>("")
  const [pdqs, setPdqs] = useState<string[]>([])
  const [thirdPartyName, setThirdPartyName] = useState<string>("")
  const [thirdParties, setThirdParties] = useState<string[]>([])
  const [pettyCashName, setPettyCashName] = useState<string>("")
  const [pettyCashes, setPettyCashes] = useState<string[]>([])

  useEffect(() => {
    // Simulate fetching employee data based on empid
    const foundEmp = mockEmployeeData.find((e) => e.id === empid)
    setEmpobj(foundEmp || null)
  }, [empid])

  const goToEdit = () => {
    // In a Next.js app, you would use useRouter here:
    // const router = useRouter();
    // router.push(`/ROS/emp-management/employees/edit-employee/${empid}`);
    console.log(`Navigating to edit employee: /ROS/emp-management/employees/edit-employee/${empid}`)
  }

  const handleAddTill = () => {
    if (tillName.trim()) {
      setTills([...tills, tillName.trim()])
      setTillName("")
    }
  }

  const handleRemoveTill = (itemToRemove: string) => {
    setTills(tills.filter((item) => item !== itemToRemove))
  }

  const handleAddPdq = () => {
    if (pdqName.trim()) {
      setPdqs([...pdqs, pdqName.trim()])
      setPdqName("")
    }
  }

  const handleRemovePdq = (itemToRemove: string) => {
    setPdqs(pdqs.filter((item) => item !== itemToRemove))
  }

  const handleAddThirdParty = () => {
    if (thirdPartyName.trim()) {
      setThirdParties([...thirdParties, thirdPartyName.trim()])
      setThirdPartyName("")
    }
  }

  const handleRemoveThirdParty = (itemToRemove: string) => {
    setThirdParties(thirdParties.filter((item) => item !== itemToRemove))
  }

  const handleAddPettyCash = () => {
    if (pettyCashName.trim()) {
      setPettyCashes([...pettyCashes, pettyCashName.trim()])
      setPettyCashName("")
    }
  }

  const handleRemovePettyCash = (itemToRemove: string) => {
    setPettyCashes(pettyCashes.filter((item) => item !== itemToRemove))
  }

  const renderTabContent = () => {
    if (!empobj) {
      return <div className="p-6 text-center text-gray-500">Loading employee data...</div>
    }

    switch (empFormTab) {
      case "Basic":
        return (
          <div className="container p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Joining Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Joining Date</div>
                  <div className="text-base font-medium">
                    {empobj.basicInfo.joiningInfo.joiningDate
                      ? format(new Date(empobj.basicInfo.joiningInfo.joiningDate), "dd MMMM yyyy")
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-6 border-t-2 border-gray-200" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Employee Details</h3>
              <p className="text-sm text-gray-500 mb-4">Profile Photo</p>
              <div className="w-36 h-36 rounded-lg shadow-md flex items-center justify-center overflow-hidden mb-6">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage src={empobj.basicInfo.empDetails.empImgUrl || "/placeholder.svg"} alt="Employee Image" />
                  <AvatarFallback>
                    <User className="h-12 w-12 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">First Name</div>
                  <div className="text-base font-medium">{empobj.basicInfo.empDetails.firstName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Middle Name</div>
                  <div className="text-base font-medium">{empobj.basicInfo.empDetails.middleName || "N/A"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Last Name</div>
                  <div className="text-base font-medium">{empobj.basicInfo.empDetails.lastName}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Address</div>
                  <div className="text-base font-medium">{empobj.basicInfo.empDetails.addr}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Zip Code</div>
                  <div className="text-base font-medium">{empobj.basicInfo.empDetails.zip}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Town/City</div>
                  <div className="text-base font-medium">{empobj.basicInfo.empDetails.city}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">State/Region</div>
                  <div className="text-base font-medium">{empobj.basicInfo.empDetails.state}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Country</div>
                  <div className="text-base font-medium">{empobj.basicInfo.empDetails.country}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Email</div>
                  <div className="text-base font-medium">{empobj.basicInfo.empDetails.email}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Mobile Number</div>
                  <div className="text-base font-medium">{empobj.basicInfo.empDetails.mobile}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Telephone</div>
                  <div className="text-base font-medium">{empobj.basicInfo.empDetails.telephone || "N/A"}</div>
                </div>
              </div>
            </div>
            <hr className="my-6 border-t-2 border-gray-200" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Departments Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Department</div>
                  <div className="text-base font-medium">{empobj.basicInfo.deptDetails.department}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Position</div>
                  <div className="text-base font-medium">{empobj.basicInfo.deptDetails.position}</div>
                </div>
              </div>
            </div>
            <hr className="my-6 border-t-2 border-gray-200" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Location Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-left">
                      <h4 className="font-bold mb-2">Location</h4>
                      <p>ABT Cafeteria LTD</p>
                      <p>Cremes Cafe</p>
                      <p>Cafe 3</p>
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold mb-2">Set Primary Location</h4>
                      <p>Primary Account</p>
                      <p>-</p>
                      <p>-</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <hr className="my-6 border-t-2 border-gray-200" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Kin Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">First Name</div>
                  <div className="text-base font-medium">{empobj.basicInfo.kinInfo.firstName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Middle Name</div>
                  <div className="text-base font-medium">{empobj.basicInfo.kinInfo.middleName || "N/A"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Last Name</div>
                  <div className="text-base font-medium">{empobj.basicInfo.kinInfo.lastName}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Address</div>
                  <div className="text-base font-medium">{empobj.basicInfo.kinInfo.addr}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Zip Code</div>
                  <div className="text-base font-medium">{empobj.basicInfo.kinInfo.zip}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Email</div>
                  <div className="text-base font-medium">{empobj.basicInfo.kinInfo.email}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Mobile Number</div>
                  <div className="text-base font-medium">{empobj.basicInfo.kinInfo.mobile}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Telephone</div>
                  <div className="text-base font-medium">{empobj.basicInfo.kinInfo.telephone || "N/A"}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Relation</div>
                  <div className="text-base font-medium">{empobj.basicInfo.kinInfo.relation}</div>
                </div>
              </div>
            </div>
          </div>
        )
      case "Bank":
        return (
          <div className="container p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Bank Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Bank Name</div>
                  <div className="text-base font-medium">{empobj.bankDetails.BankInfo.BankName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Branch Account</div>
                  <div className="text-base font-medium">{empobj.bankDetails.BankInfo.BranchAcc}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Account Holder Name</div>
                  <div className="text-base font-medium">{empobj.bankDetails.BankInfo.AccHolderName}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Bank Sort Code</div>
                  <div className="text-base font-medium">{empobj.bankDetails.BankInfo.BranchSortCode}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Account Number</div>
                  <div className="text-base font-medium">{empobj.bankDetails.BankInfo.AccNumber}</div>
                </div>
              </div>
            </div>
            <hr className="my-6 border-t-2 border-gray-200" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Salary Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Employee Type</div>
                  <div className="text-base font-medium">{empobj.bankDetails.salaryInfo.EmployeeType}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Salary Type</div>
                  <div className="text-base font-medium">{empobj.bankDetails.salaryInfo.Salary}</div>
                </div>
              </div>
            </div>
          </div>
        )
      case "Shifts":
        return (
          <div className="container p-6">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>DATE</TableHead>
                    <TableHead>LOCATION</TableHead>
                    <TableHead>START TIME</TableHead>
                    <TableHead>END TIME</TableHead>
                    <TableHead>BREAK</TableHead>
                    <TableHead>APPROVED</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ShiftDetails.map((shift, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>{shift.Shift_date}</TableCell>
                      <TableCell>{shift.location}</TableCell>
                      <TableCell>{shift.startTime}</TableCell>
                      <TableCell>{shift.endTime}</TableCell>
                      <TableCell>{shift.break}</TableCell>
                      <TableCell>{shift.approved}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )
      case "Docs":
        return (
          <div className="container p-6">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>DOCUMENT NAME</TableHead>
                    <TableHead>DESCRIPTION</TableHead>
                    <TableHead>DOCUMENT TYPE</TableHead>
                    <TableHead>ATTACHMENT</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DocDetails.map((doc, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>{doc.docName}</TableCell>
                      <TableCell>{doc.desp}</TableCell>
                      <TableCell>{doc.docType}</TableCell>
                      <TableCell>{doc.attachment}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )
      case "Statutory":
        return (
          <div className="container p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Statutory</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Nationality</div>
                  <div className="text-base font-medium">{empobj.StatutoryInfo.BankInfo.Nationality}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Place of Birth</div>
                  <div className="text-base font-medium">{empobj.StatutoryInfo.BankInfo.PlaceofBirth}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Date of Birth</div>
                  <div className="text-base font-medium">{empobj.StatutoryInfo.BankInfo.DateofBirth}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Gender</div>
                  <div className="text-base font-medium">{empobj.StatutoryInfo.BankInfo.Gender}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Age</div>
                  <div className="text-base font-medium">{empobj.StatutoryInfo.BankInfo.Age}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Marital Status</div>
                  <div className="text-base font-medium">{empobj.StatutoryInfo.BankInfo.MaritalStatus}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Passport Number</div>
                  <div className="text-base font-medium">{empobj.StatutoryInfo.BankInfo.PassportNumber}</div>
                </div>
              </div>
            </div>
            <hr className="my-6 border-t-2 border-gray-200" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">NI Number</h3>
              <p className="text-sm text-gray-500 mb-2">National Insurance Number</p>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">NI Number</div>
                  <div className="text-base font-medium">{empobj.StatutoryInfo.NInumber.NInumber}</div>
                </div>
              </div>
            </div>
            <hr className="my-6 border-t-2 border-gray-200" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Tax - P45</h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <div className="text-base font-medium">
                    {empobj.StatutoryInfo.Tax.HavingtaxP45 ? "Employee has a Tax - P45" : "Not Applicable"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "Statements":
        return (
          <div className="container p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Employee Statement</h3>
              <div className="text-base font-medium">
                {empobj.StatmentsInfo.EmployeeStatement.Statement === "Statement1" && (
                  <>
                    This is my first job since last 6th April and I have not been receiving taxable jobseeker's
                    allowances <br /> and support allowances or taxable incapacity benefits or a State or Occupation
                    pension
                  </>
                )}
                {empobj.StatmentsInfo.EmployeeStatement.Statement === "Statement2" && (
                  <>
                    This is my only job now, but since last 6th April I have had another job, or received taxable
                    jobseeker's <br /> allowance or employment and support allowances or taxable incapacity benefits
                  </>
                )}
                {empobj.StatmentsInfo.EmployeeStatement.Statement === "Statement3" && (
                  <>I do not receive a state or I have another job or receive a state or Occupational pension</>
                )}
              </div>
            </div>
            <hr className="my-6 border-t-2 border-gray-200" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Student Loan</h3>
              <div className="text-base font-medium">
                {empobj.StatmentsInfo.studentLoan.studentLoan === "Yes"
                  ? "Employee has a Student Loan"
                  : "Not Applicable"}
              </div>
            </div>
            <hr className="my-6 border-t-2 border-gray-200" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Medical Condition</h3>
              <div className="text-base font-medium">{empobj.StatmentsInfo.medicalCondition.MedicalCondition}</div>
            </div>
          </div>
        )
      case "Accounting":
        return (
          <div className="container p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Account settings</h2>
              <Button className="bg-black text-white hover:bg-gray-800">
                <Save className="h-4 w-4 mr-2" />
                SAVE
              </Button>
            </div>
            <hr className="my-6 border-t-2 border-gray-200" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="col-span-1">
                <h3 className="text-xl font-semibold">Currency</h3>
              </div>
              <div className="col-span-2">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <hr className="my-6 border-t-2 border-gray-200" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="col-span-1">
                <h3 className="text-xl font-semibold">EPOS System</h3>
              </div>
              <div className="col-span-2 space-y-4">
                {/* Till */}
                <div className="flex items-center gap-4">
                  <Label className="w-20">Till</Label>
                  <Input
                    placeholder="Add Till Name"
                    value={tillName}
                    onChange={(e) => setTillName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddTill} className="bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 ml-24">
                  {tills.map((till, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center px-3 py-2 text-sm">
                      {till}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTill(till)}
                        className="ml-2 h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <hr className="my-4 border-t border-gray-200" />

                {/* PDQs */}
                <div className="flex items-center gap-4">
                  <Label className="w-20">PDQs</Label>
                  <Input
                    placeholder="Add PDQ Name"
                    value={pdqName}
                    onChange={(e) => setPdqName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddPdq} className="bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 ml-24">
                  {pdqs.map((pdq, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center px-3 py-2 text-sm">
                      {pdq}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePdq(pdq)}
                        className="ml-2 h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <hr className="my-4 border-t border-gray-200" />

                {/* Third Party */}
                <div className="flex items-center gap-4">
                  <Label className="w-20">Third Party Name</Label>
                  <Input
                    placeholder="Add Third Party Name"
                    value={thirdPartyName}
                    onChange={(e) => setThirdPartyName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddThirdParty} className="bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 ml-24">
                  {thirdParties.map((tp, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center px-3 py-2 text-sm">
                      {tp}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveThirdParty(tp)}
                        className="ml-2 h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <hr className="my-4 border-t border-gray-200" />

                {/* Petty Cash */}
                <div className="flex items-center gap-4">
                  <Label className="w-20">Petty Cash Name</Label>
                  <Input
                    placeholder="Add Petty Cash Name"
                    value={pettyCashName}
                    onChange={(e) => setPettyCashName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddPettyCash} className="bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 ml-24">
                  {pettyCashes.map((pc, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center px-3 py-2 text-sm">
                      {pc}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePettyCash(pc)}
                        className="ml-2 h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Card className="lg:w-60 flex-shrink-0 shadow-md rounded-none lg:rounded-r-lg p-0 border-none lg:border-r">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold px-4 pt-4">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={empFormTab} onValueChange={setEmpFormTab} orientation="vertical" className="w-full">
            <TabsList className="flex flex-col h-auto p-0 bg-transparent">
              {[
                { name: "Basic Information", value: "Basic", icon: <User className="h-4 w-4 mr-2" /> },
                { name: "Bank Details", value: "Bank", icon: <Banknote className="h-4 w-4 mr-2" /> },
                { name: "Shifts", value: "Shifts", icon: <Calendar className="h-4 w-4 mr-2" /> },
                { name: "Documents", value: "Docs", icon: <FileText className="h-4 w-4 mr-2" /> },
                { name: "Statutory", value: "Statutory", icon: <ClipboardList className="h-4 w-4 mr-2" /> },
                { name: "Statements", value: "Statements", icon: <DollarSign className="h-4 w-4 mr-2" /> },
                { name: "Accounting", value: "Accounting", icon: <CreditCard className="h-4 w-4 mr-2" /> },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`w-full justify-start px-6 py-4 text-base font-medium data-[state=active]:bg-gray-100 data-[state=active]:shadow-inner data-[state=active]:text-black`}
                >
                  {tab.icon}
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Edit Button (hidden for Accounting tab) */}
        {empFormTab !== "Accounting" && (
          <div className="flex justify-end mb-6">
            <Button onClick={goToEdit} className="bg-black text-white hover:bg-gray-800">
              <Pencil className="h-4 w-4 mr-2" />
              EDIT
            </Button>
          </div>
        )}

        {renderTabContent()}
      </div>
    </div>
  )
}

export default EmpProfileComponent
