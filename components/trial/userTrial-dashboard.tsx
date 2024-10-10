"use client"

import { useState } from "react"
import Image from "next/image"
import { CalendarIcon, BookOpenIcon, CreditCardIcon, UserIcon, MenuIcon, HomeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const user = {
    name: "Alice Johnson",
    email: "alice@example.com",
    memberId: "MEM12345",
    phoneNumber: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=100&width=100",
  }

  const lentBooks = [
    { id: 1, name: "The Great Gatsby", isbn: "9780743273565", image: "/placeholder.svg?height=80&width=60", returnDate: "2023-07-15", issueDate: "2023-06-15", author: "F. Scott Fitzgerald" },
    { id: 2, name: "To Kill a Mockingbird", isbn: "9780446310789", image: "/placeholder.svg?height=80&width=60", returnDate: "2023-07-20", issueDate: "2023-06-20", author: "Harper Lee" },
    { id: 3, name: "1984", isbn: "9780451524935", image: "/placeholder.svg?height=80&width=60", returnDate: "2023-07-25", issueDate: "2023-06-25", author: "George Orwell" },
    { id: 4, name: "Pride and Prejudice", isbn: "9780141439518", image: "/placeholder.svg?height=80&width=60", returnDate: "2023-07-30", issueDate: "2023-06-30", author: "Jane Austen" },
    { id: 5, name: "The Catcher in the Rye", isbn: "9780316769174", image: "/placeholder.svg?height=80&width=60", returnDate: "2023-08-05", issueDate: "2023-07-05", author: "J.D. Salinger" },
  ]

  const boughtBooks = [
    { id: 6, name: "The Hobbit", isbn: "9780547928227", image: "/placeholder.svg?height=80&width=60", boughtOn: "2023-05-01", author: "J.R.R. Tolkien" },
    { id: 7, name: "Harry Potter and the Sorcerer's Stone", isbn: "9780590353427", image: "/placeholder.svg?height=80&width=60", boughtOn: "2023-05-15", author: "J.K. Rowling" },
    { id: 8, name: "The Da Vinci Code", isbn: "9780307474278", image: "/placeholder.svg?height=80&width=60", boughtOn: "2023-05-30", author: "Dan Brown" },
    { id: 9, name: "The Hunger Games", isbn: "9780439023528", image: "/placeholder.svg?height=80&width=60", boughtOn: "2023-06-10", author: "Suzanne Collins" },
    { id: 10, name: "The Alchemist", isbn: "9780062315007", image: "/placeholder.svg?height=80&width=60", boughtOn: "2023-06-25", author: "Paulo Coelho" },
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
      <div className={`bg-white w-64 fixed h-full transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <nav>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleTabChange("home")}>
              <HomeIcon className="mr-2 h-4 w-4" /> Home
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleTabChange("profile")}>
              <UserIcon className="mr-2 h-4 w-4" /> User Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleTabChange("books")}>
              <BookOpenIcon className="mr-2 h-4 w-4" /> Books Issued
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleTabChange("subscriptions")}>
              <CreditCardIcon className="mr-2 h-4 w-4" /> Subscriptions
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Button variant="outline" className="md:hidden mb-4" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <MenuIcon className="h-4 w-4" />
        </Button>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="hidden">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="profile">User Profile</TabsTrigger>
            <TabsTrigger value="books">Books Issued</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <Card>
              <CardHeader>
                <CardTitle>Welcome, {user.name}!</CardTitle>
                <CardDescription>Here&apos;s an overview of your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-gray-500">Member ID: {user.memberId}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Current Subscription</h3>
                    <Card>
                      <CardContent className="flex justify-between items-center p-4">
                        <div>
                          <p className="font-medium">{activeSubscription.name}</p>
                          <p className="text-sm text-gray-500">Valid until: {activeSubscription.validity}</p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Books Lent</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {lentBooks.slice(0, 3).map((book) => (
                        <Card key={book.id}>
                          <CardContent className="flex items-center space-x-4 p-4">
                            <Image src={book.image} alt={book.name} width={60} height={80} className="object-cover" />
                            <div>
                              <p className="font-medium">{book.name}</p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <CalendarIcon className="mr-1 h-4 w-4" />
                                Return by: {book.returnDate}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {lentBooks.length > 3 && (
                      <Button variant="link" className="mt-2" onClick={() => handleTabChange("books")}>
                        View all lent books
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>User Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberId">Member ID</Label>
                  <Input id="memberId" defaultValue={user.memberId} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" defaultValue={user.phoneNumber} />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="books">
            <Card>
              <CardHeader>
                <CardTitle>Books Issued</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Lent Books */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Books Lent</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {lentBooks.map((book) => (
                        <Dialog key={book.id}>
                          <DialogTrigger asChild>
                            <Card className="cursor-pointer hover:bg-gray-100 transition-colors">
                              <CardContent className="flex items-center space-x-4 p-4">
                                <Image src={book.image} alt={book.name} width={60} height={80} className="object-cover" />
                                <div>
                                  <p className="font-medium">{book.name}</p>
                                  <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <CalendarIcon className="mr-1 h-4 w-4" />
                                    Return by: {book.returnDate}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{book.name}</DialogTitle>
                              <DialogDescription>
                                <p>Author: {book.author}</p>
                                <p>ISBN: {book.isbn}</p>
                                <p>Issue Date: {book.issueDate}</p>
                                <p>Return Date: {book.returnDate}</p>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </div>

                  {/* Bought Books */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Books Bought</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {boughtBooks.map((book) => (
                        <Dialog key={book.id}>
                          <DialogTrigger asChild>
                            <Card className="cursor-pointer hover:bg-gray-100 transition-colors">
                              <CardContent className="flex items-center space-x-4 p-4">
                                <Image src={book.image} alt={book.name} width={60} height={80} className="object-cover" />
                                <div>
                                  <p className="font-medium">{book.name}</p>
                                  <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                                  <p className="text-sm text-gray-500">Bought on: {book.boughtOn}</p>
                                </div>
                              </CardContent>
                            </Card>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{book.name}</DialogTitle>
                              <DialogDescription>
                                <p>Author: {book.author}</p>
                                <p>ISBN: {book.isbn}</p>
                                <p>Purchase Date: {book.boughtOn}</p>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Active Subscription */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Active Subscription</h3>
                    <Card>
                      <CardContent className="flex justify-between items-center p-4">
                        <div>
                          <p className="font-medium">{activeSubscription.name}</p>
                          <p className="text-sm text-gray-500">Valid until: {activeSubscription.validity}</p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Available Subscriptions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Available Subscriptions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableSubscriptions.map((sub) => (
                        <Card key={sub.id}>
                          <CardHeader>
                            <CardTitle>{sub.name}</CardTitle>
                            <CardDescription>{sub.price}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="w-full">
                                  <CreditCardIcon className="mr-2 h-4 w-4" /> Subscribe
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Upgrade Subscription</DialogTitle>
                                  <DialogDescription>
                                    Visit the store to upgrade your subscription to {sub.name}.
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}