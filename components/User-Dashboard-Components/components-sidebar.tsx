'use client'

import { Button } from "@/components/ui/button"
import { HomeIcon, UserIcon, BookOpenIcon, CreditCardIcon } from "lucide-react"

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="bg-white w-64 h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <nav>
        <Button
          variant={activeTab === "home" ? "default" : "ghost"}
          className="w-full justify-start mb-2"
          onClick={() => onTabChange("home")}
        >
          <HomeIcon className="mr-2 h-4 w-4" /> Home
        </Button>
        <Button
          variant={activeTab === "profile" ? "default" : "ghost"}
          className="w-full justify-start mb-2"
          onClick={() => onTabChange("profile")}
        >
          <UserIcon className="mr-2 h-4 w-4" /> User Profile
        </Button>
        <Button
          variant={activeTab === "books" ? "default" : "ghost"}
          className="w-full justify-start mb-2"
          onClick={() => onTabChange("books")}
        >
          <BookOpenIcon className="mr-2 h-4 w-4" /> Books Issued
        </Button>
        <Button
          variant={activeTab === "subscriptions" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onTabChange("subscriptions")}
        >
          <CreditCardIcon className="mr-2 h-4 w-4" /> Subscriptions
        </Button>
      </nav>
    </div>
  )
}