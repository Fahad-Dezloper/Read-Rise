"use client"

import { useEffect, useState } from "react"
import { Search, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Mock data for lent books
const lentBooks = [
  { id: 1, memberId: "M001", bookName: "The Great Gatsby", isbn: "9780743273565", dueDate: "2023-07-01" },
  { id: 2, memberId: "M002", bookName: "To Kill a Mockingbird", isbn: "9780446310789", dueDate: "2023-06-25" },
  { id: 3, memberId: "M003", bookName: "1984", isbn: "9780451524935", dueDate: "2023-07-05" },
]

// Mock data for user books
const userBooks = {
  bought: [
    { id: 1, bookName: "Pride and Prejudice", isbn: "9780141439518", purchaseDate: "2023-05-15" },
    { id: 2, bookName: "The Catcher in the Rye", isbn: "9780316769174", purchaseDate: "2023-06-01" },
  ],
  lent: [
    { id: 3, bookName: "The Great Gatsby", isbn: "9780743273565", dueDate: "2023-07-01" },
    { id: 4, bookName: "1984", isbn: "9780451524935", dueDate: "2023-07-05" },
  ],
}

export function ReturnBookTabComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLendReturnDialogOpen, setIsLendReturnDialogOpen] = useState(false)
  const [isSaleReturnDialogOpen, setIsSaleReturnDialogOpen] = useState(false)
  const [memberId, setMemberId] = useState("")
  const [ user, setUser ] = useState(null);

    useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/queries/fetchUserLendBooks'); 
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUser(data);
        console.log("lend user:- ", user);
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);
  
  
  
  
  
  
  const filteredLentBooks = lentBooks.filter((item) => {
    const matchesSearch = item.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.isbn.includes(searchQuery)
    const matchesFilter = filterType === "all" ||
                          (filterType === "upcoming" && new Date(item.dueDate) > new Date()) ||
                          (filterType === "overdue" && new Date(item.dueDate) < new Date())
    return matchesSearch && matchesFilter
  })

  const handleReturn = (id, type) => {
    // Here you would typically send this data to your backend
    console.log(`Returning ${type} book with id: ${id}`)
    alert(`Book returned successfully!`)
  }

  const calculateLateFee = (dueDate) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = Math.abs(today - due)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays * 2 : 0
  }

  return (
    <Card className="md:rounded-lg rounded-none">
      <CardHeader>
        <CardTitle>Return Book</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ISBN, Member ID, or Book Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Dialog open={isLendReturnDialogOpen} onOpenChange={setIsLendReturnDialogOpen}>
              <DialogTrigger asChild>
                <Button>Lend Return</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lend Return</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter Member ID"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                  />
                  {memberId && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Lent Books</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Book Name</TableHead>
                            <TableHead>ISBN</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Late Fee</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userBooks.lent.map((book) => (
                            <TableRow key={book.id}>
                              <TableCell>{book.bookName}</TableCell>
                              <TableCell>{book.isbn}</TableCell>
                              <TableCell>{book.dueDate}</TableCell>
                              <TableCell>${calculateLateFee(book.dueDate)}</TableCell>
                              <TableCell>
                                <Button size="sm" onClick={() => handleReturn(book.id, 'lend')}>Return</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isSaleReturnDialogOpen} onOpenChange={setIsSaleReturnDialogOpen}>
              <DialogTrigger asChild>
                <Button>Sale Return</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sale Return</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter Member ID"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                  />
                  {memberId && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Bought Books</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Book Name</TableHead>
                            <TableHead>ISBN</TableHead>
                            <TableHead>Purchase Date</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userBooks.bought.map((book) => (
                            <TableRow key={book.id}>
                              <TableCell>{book.bookName}</TableCell>
                              <TableCell>{book.isbn}</TableCell>
                              <TableCell>{book.purchaseDate}</TableCell>
                              <TableCell>
                                <Button size="sm" onClick={() => handleReturn(book.id, 'sale')}>Return</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="hidden md:block">
            <Tabs value={filterType} onValueChange={setFilterType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Lent Books</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming Returns</TabsTrigger>
                <TabsTrigger value="overdue">Overdue Returns</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="md:hidden">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter lent books" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lent Books</SelectItem>
                <SelectItem value="upcoming">Upcoming Returns</SelectItem>
                <SelectItem value="overdue">Overdue Returns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Book Name</TableHead>
                  <TableHead className="hidden md:table-cell">ISBN</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Late Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user?.map((user) => (
                  user.lentBooks.map((book) => (
                    <TableRow key={book.id}>
                    <TableCell>{user.memberID}</TableCell>
                    <TableCell>{book.bookName}</TableCell>
                    <TableCell className="hidden md:table-cell">{book.bookIsbn}</TableCell>
                      <TableCell>3 days</TableCell>
                    {/* <TableCell>${calculateLateFee(user.dueDate)}</TableCell> */}
                  </TableRow>  
                  ))
                ))}
                  {/* <TableRow key={user.id}>
                    <TableCell>{user.memberID}</TableCell>
                    <TableCell>{user.LentBooks.bookName}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.isbn}</TableCell>
                    <TableCell>{user.dueDate}</TableCell>
                    <TableCell>${calculateLateFee(user.dueDate)}</TableCell>
                  </TableRow> */}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}