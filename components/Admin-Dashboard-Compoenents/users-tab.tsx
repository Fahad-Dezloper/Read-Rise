'use client'

import { useState } from "react"
import { Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export function UsersTabComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [userFilter, setUserFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)

  // Mock data for users
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", plan: "Basic", booksLent: 2, memberID: "M001" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210", plan: "Premium", booksLent: 0, memberID: "M002" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", phone: "456-789-0123", plan: "Bronze", booksLent: 1, memberID: "M003" },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesUserFilter = userFilter === "all" || 
                              (userFilter === "expiry" && user.plan !== "Basic") ||
                              (userFilter === "lent" && user.booksLent > 0)
    const matchesPlanFilter = planFilter === "all" || user.plan.toLowerCase() === planFilter.toLowerCase()

    return matchesSearch && matchesUserFilter && matchesPlanFilter
  })

  const handleUpdateUser = (userId, newPlan) => {
    // Update user logic here
    alert("User updated successfully")
  }

  const handleDeleteUser = (userId) => {
    // Delete user logic here
    alert("User deleted successfully")
  }

  return (
    <Card className="md:rounded-lg rounded-none">
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:hidden">
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="expiry">Subscription Expiry</SelectItem>
                <SelectItem value="lent">Books Lent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="hidden md:block">
            <Tabs value={userFilter} onValueChange={setUserFilter}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="expiry">Subscription Expiry</TabsTrigger>
                <TabsTrigger value="lent">Books Lent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="md:table-cell hidden">Email</TableHead>
                <TableHead className="md:table-cell hidden">Phone</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead className="md:table-cell hidden">Plan</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="md:table-cell hidden">{user.email}</TableCell>
                  <TableCell className="md:table-cell hidden">{user.phone}</TableCell>
                  <TableCell>{user.memberID}</TableCell>
                  <TableCell className="md:table-cell hidden">{user.plan}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>User Details</DialogTitle>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="space-y-4">
                            <p><strong>Name:</strong> {selectedUser.name}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Phone:</strong> {selectedUser.phone}</p>
                            <p><strong>Member ID:</strong> {selectedUser.memberID}</p>
                            <div className="flex items-center space-x-2">
                              <strong>Subscription Plan:</strong>
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
                            <p><strong>Books Lent:</strong> {selectedUser.booksLent}</p>
                            <div className="flex justify-between">
                              <Button onClick={() => handleUpdateUser(selectedUser.id, selectedUser.plan)}>
                                Save Details
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the user's account and remove their data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(selectedUser.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}