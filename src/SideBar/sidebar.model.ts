export interface SidebarItem {
  name: string;
  link: string;
  icon: string;
}

export interface Sidebar {
  name: string;
  pages: string;
  link: string;
  icon: string;
  children: SidebarItem[];
}

export const SIDEBAR_MENU_ITEMS: Sidebar[] = [
  {
    name: "Cash Management",
    pages: "pages1",
    link: "accounting",
    icon: "icon-cashmanagement icon",
    children: [
      {
        name: "Cash Up",
        link: "/accounting/cashup",
        icon: "icon-cashup icon",
      },
      {
        name: "Deposit",
        link: "/accounting/cashup/deposit",
        icon: "icon-deposit icon",
      },
      {
        name: "Reconciliation",
        link: "/accounting/reconciliation/home",
        icon: "icon-reconciliation icon",
      },
      {
        name: "Reports",
        link: "/accounting/report/home",
        icon: "icon-report icon",
      },
      {
        name: "Safe Summary",
        link: "/accounting/safesummary",
        icon: "icon-report icon",
      },
    ],
  },
  {
    name: "Integration",
    pages: "pages4",
    link: "/integration",
    icon: "icon-integration icon",
    children: []
  },
  {
    name: "Employees",
    pages: "pages2",
    link: "",
    icon: "icon-employee icon",
    children: [
      {
        name: "Employees",
        link: "/emp-management/employees/all-employee",
        icon: "icon-team icon",
      },
      {
        name: "Shift Calendar",
        link: "/emp-management/shift-calendar/landing",
        icon: "icon-payroll icon",
      },
      {
        name: "Attendance",
        link: "/emp-management/attendance",
        icon: "icon-rota icon",
      },
      {
        name: "Requests",
        link: "/emp-management/approvals",
        icon: "icon-requests icon",
      },
      {
        name: "Leaves",
        link: "/emp-management/leaves",
        icon: "icon-leaves icon",
      },
      {
        name: "User Mapping",
        link: "/emp-management/user-mapping",
        icon: "icon-profile icon",
      },
      {
        name: "Payroll",
        link: "/emp-management/payroll/all-payroll",
        icon: "icon-report icon",
      },
      {
        name: "Profile",
        link: "/emp-management/profile",
        icon: "icon-profile icon",
      },
    ],
  },
  {
    name: "Settings",
    pages: "pages5",
    link: "/settings",
    icon: "icon-setting icon",
    children: [
      {
        name: "Account",
        link: "/account",
        icon: "icon-integration icon",
      },
    ]
  },
]; 