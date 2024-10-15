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
import { useUser } from '@/app/UserContext';

interface User {
  id: string;
  name: string;
    email: string;
  role: string;
  subscription?: Subscription;
}

interface UserComponentProps {
  email: string;
}

interface Subscription {
  planType: string;
  status: string;
  startDate: Date;
  endDate: Date;
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
          console.log("user with subscription", userData);
        } catch (err) {
          setError('Error fetching user data');
          console.error(err);
        }
    };
    
    fetchUser();
  }, [email, setUser]);

  if (error) return <div>{error}</div>;

  const lentBooks = [
    { id: 1, name: "The Great Gatsby", isbn: "9780743273565", image: "https://m.media-amazon.com/images/I/71ptoyWH8dL._AC_UF1000,1000_QL80_.jpg?height=80&width=60", returnDate: "2023-07-15", issueDate: "2023-06-15", author: "F. Scott Fitzgerald" },
    { id: 2, name: "To Kill a Mockingbird", isbn: "9780446310789", image: "https://m.media-amazon.com/images/I/51+PolL6xgL._SY445_SX342_.jpg?height=80&width=60", returnDate: "2023-07-20", issueDate: "2023-06-20", author: "Harper Lee" },
    { id: 3, name: "1984", isbn: "9780451524935", image: "https://m.media-amazon.com/images/I/41BkabfiHuL._SY445_SX342_.jpg?height=80&width=60", returnDate: "2023-07-25", issueDate: "2023-06-25", author: "George Orwell" },
    { id: 4, name: "Pride and Prejudice", isbn: "9780141439518", image: "https://m.media-amazon.com/images/I/412bjj40hoL._SY445_SX342_.jpg?height=80&width=60", returnDate: "2023-07-30", issueDate: "2023-06-30", author: "Jane Austen" },
    { id: 5, name: "The Catcher in the Rye", isbn: "9780316769174", image: "https://m.media-amazon.com/images/I/418bOQWiRBL._SY445_SX342_.jpg?height=80&width=60", returnDate: "2023-08-05", issueDate: "2023-07-05", author: "J.D. Salinger" },
  ]

  const boughtBooks = [
    { id: 6, name: "The Hobbit", isbn: "9780547928227", image: "https://m.media-amazon.com/images/I/51lWLTxft+L._SY445_SX342_.jpg?height=80&width=60", boughtOn: "2023-05-01", author: "J.R.R. Tolkien" },
    { id: 7, name: "Harry Potter and the Sorcerer's Stone", isbn: "9780590353427", image: "https://m.media-amazon.com/images/I/51dOacmuzvL._SY445_SX342_.jpg?height=80&width=60", boughtOn: "2023-05-15", author: "J.K. Rowling" },
    { id: 8, name: "The Da Vinci Code", isbn: "9780307474278", image: "https://m.media-amazon.com/images/I/41Xh2DgrhvL._SY445_SX342_.jpg?height=80&width=60", boughtOn: "2023-05-30", author: "Dan Brown" },
    { id: 9, name: "The Hunger Games", isbn: "9780439023528", image: "https://m.media-amazon.com/images/I/51n4GJK-TGS._SY445_SX342_.jpg?height=80&width=60", boughtOn: "2023-06-10", author: "Suzanne Collins" },
    { id: 10, name: "The Alchemist", isbn: "9780062315007", image: "https://m.media-amazon.com/images/I/416JeZoF8tL._SY445_SX342_.jpg?height=80&width=60", boughtOn: "2023-06-25", author: "Paulo Coelho" },
  ]

  const activeSubscription = { id: 1, name: "Premium Plan", validity: "2023-12-31" }

  const availableSubscriptions = [
    { id: 2, name: "Basic Plan", price: "$9.99/month" },
    { id: 3, name: "Gold Plan", price: "$19.99/month" },
  ]

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
            <HomeTab lentBooks={lentBooks} onTabChange={handleTabChange} />
          </TabsContent>
          <TabsContent value="profile">
          <ProfileTab />
            {/* <ProfileTab user={user} /> */}
          </TabsContent>
          <TabsContent value="books">
            <BooksTab lentBooks={lentBooks} boughtBooks={boughtBooks} />
          </TabsContent>
          <TabsContent value="subscriptions">
            <SubscriptionsTab activeSubscription={activeSubscription} availableSubscriptions={availableSubscriptions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}