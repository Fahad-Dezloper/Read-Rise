"use client"

import { useState } from "react"
import { Menu, Sidebar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarComponent } from "../Admin-Dashboard-Compoenents/sidebar"
import { UsersTabComponent } from "../Admin-Dashboard-Compoenents/users-tab"
import { SaleTabComponent } from "../Admin-Dashboard-Compoenents/sale-tab"
import { SoldBooksTabComponent } from "../Admin-Dashboard-Compoenents/sold-books-tab"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <SidebarComponent className="hidden md:block w-64" setActiveTab={setActiveTab} />

      {/* Sidebar for mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar setActiveTab={setActiveTab} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 md:p-8 overflow-auto w-full">
        {activeTab === "users" && <UsersTabComponent />}
        {activeTab === "sale" && <SaleTabComponent />}
        {activeTab === "sold-books" && <SoldBooksTabComponent />}
      </div>
    </div>
  )
}