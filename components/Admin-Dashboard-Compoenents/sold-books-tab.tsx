'use client'

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function SoldBooksTabComponent() {
  const [selectedSoldBook, setSelectedSoldBook] = useState(null)

  // Mock data for sold books
  const soldBooks = [
    { id: 1, isbn: "1234567890", memberId: "M001", paymentMethod: "Cash", date: "2023-06-01" },
    { id: 2, isbn: "0987654321", memberId: "M002", paymentMethod: "UPI", date: "2023-06-02" },
    { id: 3, isbn: "1357924680", memberId: "M003", paymentMethod: "Card", date: "2023-06-03" },
  ]

  return (
    <Card className="md:rounded-lg rounded-none">
      <CardHeader>
        <CardTitle>Sold Books</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Search by ISBN or Member ID"
            className="flex-grow"
          />
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            className="w-full sm:w-[180px]"
          />
          <Button className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download Excel
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="md:table-cell hidden">ISBN</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="md:table-cell hidden">Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {soldBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="md:table-cell hidden">{book.isbn}</TableCell>
                  <TableCell>{book.memberId}</TableCell>
                  <TableCell>{book.paymentMethod}</TableCell>
                  <TableCell className="md:table-cell hidden">{book.date}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedSoldBook(book)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Sold Book Details</DialogTitle>
                        </DialogHeader>
                        {selectedSoldBook && (
                          <div className="space-y-4">
                            <p><strong>ISBN:</strong> {selectedSoldBook.isbn}</p>
                            <p><strong>Member ID:</strong> {selectedSoldBook.memberId}</p>
                            <p><strong>Payment Method:</strong> {selectedSoldBook.paymentMethod}</p>
                            <p><strong>Date:</strong> {selectedSoldBook.date}</p>
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