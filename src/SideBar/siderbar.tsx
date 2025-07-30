"use client"

import * as React from "react"
import { useNavigate, Outlet } from "react-router-dom"
import {
  BarChart3,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  PiggyBank,
  Search,
  Settings,
  Shield,
  TrendingUp,
  User,
  Users,
  Clock,
  CheckSquare,
  Plane,
  MapPin,
  Calculator,
  UserCircle,
} from "lucide-react"

import { Button } from "../components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar"

const sidebarData = {
  navigation: [
    {
      title: "Dashboard BI",
      icon: BarChart3,
      url: "/dashboard",
    },
  ],
  cashManagement: {
    title: "Cash Management",
    icon: CreditCard,
    items: [
      {
        title: "Cash Up",
        icon: TrendingUp,
        url: "/accounting/cashup",
      },
      {
        title: "Deposit",
        icon: PiggyBank,
        url: "/accounting/cashup/deposit",
      },
      {
        title: "Reconciliation",
        icon: FileText,
        url: "/accounting/reconciliation/home",
      },
      {
        title: "Reports",
        icon: FileText,
        url: "/accounting/report/home",
      },
      {
        title: "Safe Summary",
        icon: Shield,
        url: "/accounting/safesummary",
      },
    ],
  },
  integration: [
    {
      title: "Integration",
      icon: Settings,
      url: "/integration",
    },
  ],
  employees: {
    title: "Employees",
    icon: Users,
    items: [
      {
        title: "Employees",
        icon: User,
        url: "/emp-management/employees/all-employee",
      },
      {
        title: "Shift Calendar",
        icon: Calendar,
        url: "/emp-management/shift-calendar/landing",
      },
      {
        title: "Attendance",
        icon: Clock,
        url: "/emp-management/attendance",
      },
      {
        title: "Approval",
        icon: CheckSquare,
        url: "/emp-management/approvals",
      },
      {
        title: "Leaves",
        icon: Plane,
        url: "/emp-management/leaves",
      },
      {
        title: "Emp Mapping",
        icon: MapPin,
        url: "/emp-management/user-mapping",
      },
      {
        title: "Payroll",
        icon: Calculator,
        url: "/emp-management/payroll/all-payroll",
      },
      {
        title: "Profile",
        icon: UserCircle,
        url: "/emp-management/profile",
      },
    ],
  },
}

export function CollapsibleSidebar() {
  const [cashManagementOpen, setCashManagementOpen] = React.useState(true)
  const [employeesOpen, setEmployeesOpen] = React.useState(true)
  const navigate = useNavigate()

  const handleNavigation = (url: string) => {
    navigate(url)
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="border-b">
          <div className="flex items-center justify-between p-2">
            <SidebarTrigger className="h-8 w-8" />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Dashboard BI */}
          <SidebarGroup>
            <SidebarMenu>
              {sidebarData.navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    onClick={() => handleNavigation(item.url)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          {/* Cash Management */}
          <SidebarGroup>
            <Collapsible open={cashManagementOpen} onOpenChange={setCashManagementOpen} className="group/collapsible">
              <SidebarMenu>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={sidebarData.cashManagement.title}>
                      <sidebarData.cashManagement.icon className="h-4 w-4" />
                      <span>{sidebarData.cashManagement.title}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {sidebarData.cashManagement.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            onClick={() => handleNavigation(subItem.url)}
                          >
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </SidebarMenu>
            </Collapsible>
          </SidebarGroup>

          {/* Integration */}
          <SidebarGroup>
            <SidebarMenu>
              {sidebarData.integration.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    onClick={() => handleNavigation(item.url)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          {/* Employees */}
          <SidebarGroup>
            <Collapsible open={employeesOpen} onOpenChange={setEmployeesOpen} className="group/collapsible">
              <SidebarMenu>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={sidebarData.employees.title}>
                      <sidebarData.employees.icon className="h-4 w-4" />
                      <span>{sidebarData.employees.title}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {sidebarData.employees.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            onClick={() => handleNavigation(subItem.url)}
                          >
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </SidebarMenu>
            </Collapsible>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <h1 className="text-lg font-semibold">Solution Frontend</h1>
        </div>
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
