'use client'

import { Users, BookOpen, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SidebarComponent({ className = "", setActiveTab }) {
  return (
    <div className={`bg-white shadow-md ${className}`}>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <nav className="mt-4">
        <ul>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start p-4"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start p-4"
              onClick={() => setActiveTab("sale")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Sale
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start p-4"
              onClick={() => setActiveTab("sold-books")}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Sold Books
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}