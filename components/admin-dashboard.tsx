"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ChevronLeft, ChevronRight, Download, Search, Trash2, Users } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")
  const [searchQuery, setSearchQuery] = useState("")
  const [userFilter, setUserFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isbn, setIsbn] = useState("")
  const [memberId, setMemberId] = useState("")
  const [lendDays, setLendDays] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [saleType, setSaleType] = useState("")
  const [issuedDate, setIssuedDate] = useState(new Date())
  const [soldBooksFilter, setSoldBooksFilter] = useState({ isbn: "", memberId: "", paymentMethod: "all", date: "" })

  // Mock data for users
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", plan: "Basic" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "098-765-4321", plan: "Premium" },
    // Add more users as needed
  ]

  // Mock data for sold books
  const soldBooks = [
    { id: 1, isbn: "1234567890", memberId: "M001", paymentMethod: "Cash", date: "2023-06-01" },
    { id: 2, isbn: "0987654321", memberId: "M002", paymentMethod: "UPI", date: "2023-06-02" },
    // Add more sold books as needed
  ]

  const filteredUsers = users.filter(user => 
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (userFilter === "all" || user.plan.toLowerCase() === userFilter.toLowerCase())
  )

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedUser(null)
  }

  const UsersTab = () => (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search users..."
        // value={searchQuery}
        // onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />
      <Tabs value={userFilter} onValueChange={setUserFilter}>
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="basic">Basic Plan</TabsTrigger>
          <TabsTrigger value="bronze">Bronze Plan</TabsTrigger>
          <TabsTrigger value="premium">Premium Plan</TabsTrigger>
          <TabsTrigger value="expiry">Subscription Expiry</TabsTrigger>
          <TabsTrigger value="lent">Books Lent</TabsTrigger>
        </TabsList>
      </Tabs>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.plan}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span>Page {currentPage}</span>
        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => prev + 1)}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <p>Name: {selectedUser.name}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Phone: {selectedUser.phone}</p>
              <p>Member ID: M{String(selectedUser.id).padStart(3, '0')}</p>
              <div className="flex items-center space-x-2">
                <Label>Subscription Plan:</Label>
                <Select
                  value={selectedUser.plan}
                  onValueChange={(value) => setSelectedUser({...selectedUser, plan: value})}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between items-center">
                <Button onClick={() => {/* Implement save changes logic */}}>Save Changes</Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )

  const SaleTab = () => {
    const calculateExpiryDate = (issuedDate, lendDays) => {
      const expiryDate = new Date(issuedDate);
      expiryDate.setDate(expiryDate.getDate() + parseInt(lendDays));
      return expiryDate;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Book Sale / Lend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Enter ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
              <Button onClick={() => {/* Implement add book logic */}}>Add</Button>
            </div>
            {isbn && (
              <div className="flex space-x-2">
                <Button onClick={() => setSaleType("lend")}>Lend</Button>
                <Button onClick={() => setSaleType("sale")}>Sale</Button>
              </div>
            )}
            {saleType === "lend" && (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Member ID"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Lend Days"
                  value={lendDays}
                  onChange={(e) => setLendDays(e.target.value)}
                />
                <div className="flex space-x-2">
                  <div>
                    <Label>Issued Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {issuedDate ? issuedDate.toDateString() : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={issuedDate}
                          onSelect={setIssuedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <Input
                      type="text"
                      value={lendDays ? calculateExpiryDate(issuedDate, lendDays).toDateString() : ""}
                      readOnly
                    />
                  </div>
                </div>
                <Button>Lend Book</Button>
              </div>
            )}
            {saleType === "sale" && (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Member ID"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                />
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
                <Button>Sale Book</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const SoldBooksTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search sold books..."
          value={soldBooksFilter.isbn}
          onChange={(e) => setSoldBooksFilter({...soldBooksFilter, isbn: e.target.value})}
          className="max-w-sm"
        />
        <Button>
          <Download className="mr-2 h-4 w-4" /> Download Excel
        </Button>
      </div>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Filter by Member ID"
          value={soldBooksFilter.memberId}
          onChange={(e) => setSoldBooksFilter({...soldBooksFilter, memberId: e.target.value})}
        />
        <Select
          value={soldBooksFilter.paymentMethod}
          onValueChange={(value) => setSoldBooksFilter({...soldBooksFilter, paymentMethod: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Payment Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={soldBooksFilter.date}
          onChange={(e) => setSoldBooksFilter({...soldBooksFilter, date: e.target.value})}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ISBN</TableHead>
            <TableHead>Member ID</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {soldBooks
            .filter(book => 
              book.isbn.includes(soldBooksFilter.isbn) &&
              book.memberId.includes(soldBooksFilter.memberId) &&
              (soldBooksFilter.paymentMethod === "all" || book.paymentMethod === soldBooksFilter.paymentMethod) &&
              (soldBooksFilter.date === "" || book.date === soldBooksFilter.date)
            )
            .map(book => (
              <TableRow key={book.id}>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.memberId}</TableCell>
                <TableCell>{book.paymentMethod}</TableCell>
                <TableCell>{book.date}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white p-4">
        <nav className="space-y-2">
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-2 h-4 w-4" />
            Users
          </Button>
          <Button
            variant={activeTab === "sale" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("sale")}
          >
            <Search className="mr-2 h-4 w-4" />
            Sale
          </Button>
          <Button
            variant={activeTab === "soldBooks" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("soldBooks")}
          >
            <Search className="mr-2 h-4 w-4" />
            Sold Books
          </Button>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Tabs value={activeTab} className="space-y-4">
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
          <TabsContent value="sale">
            <SaleTab />
          </TabsContent>
          <TabsContent value="soldBooks">
            <SoldBooksTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}