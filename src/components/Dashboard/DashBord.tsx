import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTimes, faCheck, faAngleDown } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const navigate = useNavigate();
  const [myDate] = useState(new Date());
  const [prevDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  });
  const [netSalesFilter, setNetSalesFilter] = useState('D');
  const [cashupFilter, setCashupFilter] = useState('D');
  const [purchaseOrdersFilter, setPurchaseOrdersFilter] = useState('default');

  const staffRequests = [
    {
      img: "https://images.unsplash.com/photo-1582233479366-6d38bc390a08?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1061&q=80",
      name: "Francessca",
      request_type: "Shift Change",
      approved: false,
    },
    {
      img: "https://images.unsplash.com/photo-1578774296842-c45e472b3028?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=321&q=80",
      name: "John Doe",
      request_type: "Vacation Request",
      approved: false,
    },
    {
      img: "https://images.unsplash.com/photo-1568707043650-eb03f2536825?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
      name: "Aaron Cooper",
      request_type: "Edit Profile Request",
      approved: false,
    },
    {
      img: "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
      name: "Francessca",
      request_type: "Shift Request",
      approved: false,
    },
    {
      img: "https://images.unsplash.com/photo-1545506475-5a0985c3ca79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
      name: "Francessca",
      request_type: "Shift Change",
      approved: false,
    },
    {
      img: "https://images.unsplash.com/photo-1582233479366-6d38bc390a08?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1061&q=80",
      name: "Francessca",
      request_type: "Shift Change",
      approved: false,
    },
  ];

 const formatDate = (date: Date, format: "shortTime" | "mediumDate"): string => {
  if (format === "shortTime") {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (format === "mediumDate") {
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return date.toString();
};

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
};

const goToCashup = (viewState: string): void => {
  navigate("/accounting/cashup", { state: { viewState } });
};
  return (
    <div className="p-4 text-gray-800">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-medium whitespace-nowrap">
            Good Morning, Restaurant Manager
          </h4>
          <h5 className="text-lg font-medium whitespace-nowrap">
            {formatDate(myDate, "shortTime")},&nbsp;&nbsp;&nbsp;{formatDate(myDate, "mediumDate")}
          </h5>
        </div>

        {/* Top Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          {/* Net Sales Card */}
          <div className="md:col-span-5">
            <div className="bg-white rounded-lg shadow-md p-4 h-full">
              <div className="flex justify-between mb-4">
                <div 
                  className="cursor-pointer" 
                  onClick={() => goToCashup('ALL')}
                >
                  <div className="text-lg font-normal">Net Sales</div>
                  <div className="text-xs font-light text-gray-500">Progress</div>
                  <div className="border-2 border-gray-800 rounded-full bg-gray-800 w-16 mt-1 mb-2"></div>
                </div>
                <div className="flex space-x-2">
                  {['D', 'W', 'M'].map((filter) => (
                    <div
                      key={filter}
                      className={`text-xs cursor-pointer pb-1 border-b ${netSalesFilter === filter 
                        ? 'text-gray-800 border-b-2 border-gray-800' 
                        : 'text-gray-500 border-b border-gray-500'}`}
                      onClick={() => setNetSalesFilter(filter)}
                    >
                      {filter}
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Sales */}
              <div className="flex justify-between items-end mb-4">
                <div className="w-1/4 mr-3 whitespace-nowrap">
                  <div className="font-bold">Today</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(myDate, "mediumDate")}
                  </div>
                </div>
                <div className="w-2/4 mr-3">
                  <div className="h-3 bg-gray-200 rounded-full">
                    <div 
                      className="h-3 bg-gray-800 rounded-full" 
                      style={{ width: '25%' }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 italic">+ 36 % less than yesterday</div>
                </div>
                <div className="w-1/4 text-lg font-semibold">
                  {formatCurrency(120, "GBP")}
                </div>
              </div>

              {/* Yesterday's Sales */}
              <div className="flex justify-between items-end">
                <div className="w-1/4 mr-3 whitespace-nowrap">
                  <div className="font-bold">Yesterday</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(prevDate, "mediumDate")}
                  </div>
                </div>
                <div className="w-2/4 mr-3">
                  <div className="h-3 bg-gray-200 rounded-full">
                    <div 
                      className="h-3 bg-gray-800 rounded-full" 
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 italic">+ 13 % more than yesterday</div>
                </div>
                <div className="w-1/4 text-lg font-semibold">
                  {formatCurrency(120, "GBP")}
                </div>
              </div>
            </div>
          </div>

          {/* Deposits Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
              <div className="flex justify-between mb-4">
                <div 
                  className="cursor-pointer"
                  onClick={() => goToCashup('DEPOSITS')}
                >
                  <div className="text-lg font-normal">Deposits</div>
                  <div className="text-xs font-light text-gray-500">Pending</div>
                  <div className="border-2 border-gray-800 rounded-full bg-gray-800 w-16 mt-1 mb-2"></div>
                </div>
                <div className="relative">
                  <div className="absolute -right-2 -top-2 bg-gray-800 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs">
                    12
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end mb-4">
                <div className="w-1/3">
                  <div className="text-lg font-semibold whitespace-nowrap">
                    {formatCurrency(100, "GBP")}
                  </div>
                  <div className="text-xs text-gray-500">Value</div>
                </div>
              </div>
              <div 
                className="text-center text-blue-600 font-medium cursor-pointer mt-auto py-2"
                onClick={() => goToCashup('BANKED')}
              >
                CREATE <br />BANKING
              </div>
            </div>
          </div>

          {/* Cash Up Variance Card */}
          <div className="md:col-span-5">
            <div className="bg-white rounded-lg shadow-md p-4 h-full">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-lg font-normal">Cash Up Variance</div>
                  <div className="text-xs font-light text-gray-500">Difference to be Reconciled</div>
                  <div className="border-2 border-gray-800 rounded-full bg-gray-800 w-20 mt-1 mb-2"></div>
                </div>
                <div className="flex space-x-2">
                  {['D', 'W', 'M'].map((filter) => (
                    <div
                      key={filter}
                      className={`text-xs cursor-pointer pb-1 border-b ${cashupFilter === filter 
                        ? 'text-gray-800 border-b-2 border-gray-800' 
                        : 'text-gray-500 border-b border-gray-500'}`}
                      onClick={() => setCashupFilter(filter)}
                    >
                      {filter}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="w-1/3 pr-4 border-r">
                  <div className="text-lg font-semibold">
                    {formatCurrency(150, "GBP")}
                  </div>
                  <div className="text-xs text-gray-500">Total Amount</div>
                </div>
                <div className="w-full flex justify-around">
                  <div className="text-center">
                    <div className="text-base font-semibold">
                      {formatCurrency(100, "GBP")}
                    </div>
                    <div className="text-xs text-gray-500">Cash</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-semibold">
                      {formatCurrency(20, "GBP")}
                    </div>
                    <div className="text-xs text-gray-500">Card</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-semibold">
                      {formatCurrency(30, "GBP")}
                    </div>
                    <div className="text-xs text-gray-500">Third Party</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          {/* Purchase Orders Card */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-lg shadow-md p-4 h-full">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-lg font-normal">Purchase Orders</div>
                  <div className="text-xs font-light text-gray-500">Status</div>
                  <div className="border-2 border-gray-800 rounded-full bg-gray-800 w-20 mt-1 mb-2"></div>
                </div>
                <div className="text-blue-600 font-medium cursor-pointer">
                  VIEW ALL
                </div>
              </div>

              {purchaseOrdersFilter === 'default' ? (
                <div className="flex justify-around my-2">
                  {/* Drafts Box */}
                  <div 
                    className="relative bg-white rounded-xl shadow-md p-3 w-36 cursor-pointer"
                    onClick={() => setPurchaseOrdersFilter('drafts')}
                  >
                    <div className="absolute -right-2 -top-2 bg-gray-800 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs">
                      12
                    </div>
                    <div className="text-xs">Drafts</div>
                    <div className="text-2xl font-normal my-1">21</div>
                    <div className="text-xs text-gray-500 py-1">Items</div>
                    <div className="font-bold">{formatCurrency(240, "GBP")}</div>
                    <div className="text-xs text-gray-500 py-1">Value</div>
                  </div>

                  {/* Pending Approvals Box */}
                  <div className="relative bg-white rounded-xl shadow-md p-3 w-36">
                    <div className="absolute -right-2 -top-2 bg-gray-800 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs">
                      10
                    </div>
                    <div className="text-xs">Pending Approvals</div>
                    <div className="text-2xl font-normal my-1">21</div>
                    <div className="text-xs text-gray-500 py-1">Items</div>
                    <div className="font-bold">{formatCurrency(240, "GBP")}</div>
                    <div className="text-xs text-gray-500 py-1">Value</div>
                  </div>

                  {/* Approved Box */}
                  <div className="relative bg-white rounded-xl shadow-md p-3 w-36">
                    <div className="absolute -right-2 -top-2 bg-gray-800 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs">
                      5
                    </div>
                    <div className="text-xs">Approved</div>
                    <div className="text-2xl font-normal my-1">21</div>
                    <div className="text-xs text-gray-500 py-1">Items</div>
                    <div className="font-bold">{formatCurrency(240, "GBP")}</div>
                    <div className="text-xs text-gray-500 py-1">Value</div>
                  </div>
                </div>
              ) : (
                <div className="relative my-2">
                  <div className="max-h-48 overflow-y-auto">
                    <div className="text-xs font-bold mb-2">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-3 flex items-center">
                          <FontAwesomeIcon 
                            icon={faArrowLeft} 
                            className="mr-2 cursor-pointer" 
                            onClick={() => setPurchaseOrdersFilter('default')}
                          />
                          Supplier Name
                        </div>
                        <div className="col-span-3">Value</div>
                        <div className="col-span-3">Pending Since</div>
                        <div className="col-span-3 text-right">Reject/ Submit</div>
                      </div>
                    </div>
                    {staffRequests.map((r, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 py-2 border-b border-gray-100 text-sm">
                        <div className="col-span-3 flex items-center">
                          <img
                            src={r.img}
                            alt=""
                            className="w-8 h-8 rounded-full mr-2 object-cover"
                          />
                          {r.name}
                        </div>
                        <div className="col-span-3">{formatCurrency(140, "GBP")}</div>
                        <div className="col-span-3">12 hrs</div>
                        <div className="col-span-3 flex justify-end">
                          <FontAwesomeIcon 
                            icon={faTimes} 
                            className="text-red-500 mr-3 cursor-pointer" 
                          />
                          <FontAwesomeIcon 
                            icon={faCheck} 
                            className="text-green-500 cursor-pointer" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 flex justify-center items-center bg-gradient-to-b from-transparent to-white">
                    <FontAwesomeIcon icon={faAngleDown} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Staff Requests Card */}
          <div className="md:col-span-5">
            <div className="bg-white rounded-lg shadow-md p-4 h-full">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-lg font-normal">Staff Request</div>
                  <div className="border-2 border-gray-800 rounded-full bg-gray-800 w-14 mt-3 mb-2"></div>
                </div>
                <div className="text-blue-600 font-medium cursor-pointer">
                  VIEW ALL
                </div>
              </div>

              <div className="relative my-2">
                <div className="max-h-48 overflow-y-auto">
                  {staffRequests.map((r, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 py-2 border-b border-gray-100 text-sm">
                      <div className="col-span-6 flex items-center">
                        <img
                          src={r.img}
                          alt=""
                          className="w-8 h-8 rounded-full mr-2 object-cover"
                        />
                        {r.name}
                      </div>
                      <div className="col-span-4">{r.request_type}</div>
                      <div className="col-span-2 flex justify-end">
                        <FontAwesomeIcon 
                          icon={faTimes} 
                          className="text-red-500 mr-3 cursor-pointer" 
                        />
                        <FontAwesomeIcon 
                          icon={faCheck} 
                          className="text-green-500 cursor-pointer" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 flex justify-center items-center bg-gradient-to-b from-transparent to-white">
                  <FontAwesomeIcon icon={faAngleDown} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Schedule */}
            <div className="w-full md:w-2/3 pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-lg font-normal">Today's Schedule</div>
                  <div className="border-2 border-gray-800 rounded-full bg-gray-800 w-20 mt-3 mb-2"></div>
                </div>
                <div 
                  className="text-blue-600 font-medium cursor-pointer"
                  onClick={() => navigate("../../emp-management/attendance")}
                >
                  VIEW ATTENDANCE
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="grid grid-cols-6 gap-2 text-xs font-bold uppercase mb-2">
                  <div>START TIME</div>
                  <div>END TIME</div>
                  <div>ON DUTY</div>
                  <div>OFF DUTY</div>
                  <div>LEAVES</div>
                  <div>LATE</div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-6 gap-2 bg-white p-2 rounded text-sm">
                    <div>09:00</div>
                    <div>09:00</div>
                    <div>08</div>
                    <div>08</div>
                    <div>01</div>
                    <div>01</div>
                  </div>
                  <div className="grid grid-cols-6 gap-2 bg-white p-2 rounded text-sm">
                    <div>13:00</div>
                    <div>13:00</div>
                    <div>19</div>
                    <div>19</div>
                    <div>-</div>
                    <div>01</div>
                  </div>
                  <div className="grid grid-cols-6 gap-2 bg-white p-2 rounded text-sm">
                    <div>17:00</div>
                    <div>17:00</div>
                    <div>12</div>
                    <div>12</div>
                    <div>03</div>
                    <div>-</div>
                  </div>
                  <div className="grid grid-cols-6 gap-2 bg-white p-2 rounded text-sm">
                    <div>09:00</div>
                    <div>09:00</div>
                    <div>08</div>
                    <div>08</div>
                    <div>01</div>
                    <div>01</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Calendar */}
            <div className="w-full md:w-1/3 pl-0 md:pl-4 mt-4 md:mt-0">
              <div className="h-full bg-gray-100 rounded flex items-center justify-center">
                Calendar Component
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;