/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Sidebar } from "@/components/User-Dashboard-Components/components-sidebar"
import { HomeTab } from "@/components/User-Dashboard-Components/components-home-tab"
import { ProfileTab } from "@/components/User-Dashboard-Components/components-profile-tab"
import { BooksTab } from "@/components/User-Dashboard-Components/components-books-tab"
import { SubscriptionsTab } from "@/components/User-Dashboard-Components/components-subscriptions-tab"
import axios from "axios"
import { User, Subscription } from '@/lib/typess';
import { useUser } from '@/app/UserContext';


interface UserComponentProps {
  email: string;
}


export function UserDashboardMain({ email }: UserComponentProps) {
  const [activeTab, setActiveTab] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { setUser } = useUser(); // Get setUser from context
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get(`/queries/user?email=${email}`);
        const subscriptionResponse  = await axios.get(`/queries/subscription?email=${email}`);
          const userData: User = {
            ...userResponse.data,
            subscription: subscriptionResponse.data.subscription || null, 
          };

          setUser(userData);
          // console.log("user with subscription", userData);
        } catch (err) {
          setError('Error fetching user data');
          console.error(err);
        }
    };
    
    fetchUser();
  }, [email, setUser]);

  if (error) return <div>{error}</div>;


  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Button variant="outline" className="md:hidden mb-4" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <MenuIcon className="h-4 w-4" />
        </Button>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="home">
            {/* onTabChange={handleTabChange} */}
            <HomeTab />
          </TabsContent>
          <TabsContent value="profile">
          <ProfileTab />
            {/* <ProfileTab user={user} /> */}
          </TabsContent>
          <TabsContent value="books">
            <BooksTab />
          </TabsContent>
          <TabsContent value="subscriptions">
            <SubscriptionsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}