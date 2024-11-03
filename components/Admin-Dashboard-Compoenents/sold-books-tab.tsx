'use client'

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import the xlsx library

interface User {
  memberID: string; // Assuming memberID is a string, adjust if it's a number
}

interface PurchasedBook {
  length: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: any
  id: string;
  bookIsbn: string; 
  user: User; 
  purchaseMethod: string; 
  purchaseDate: string | Date; 
}

export function SoldBooksTabComponent() {
  const [selectedSoldBook, setSelectedSoldBook] = useState<PurchasedBook | null>(null)
  const [purchasedBooks, setPurchasedBooks] = useState<PurchasedBook | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

   useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/queries/allPurchasedBooks'); 
        console.log(response);
        setPurchasedBooks(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [setPurchasedBooks]);

  function formatLendDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    const suffix = (day % 10 === 1 && day !== 11) ? "st" :
                   (day % 10 === 2 && day !== 12) ? "nd" :
                   (day % 10 === 3 && day !== 13) ? "rd" : "th";

    return `${day}${suffix} ${month}, ${year}`;
}

    // filters
  const filteredBooks = purchasedBooks && purchasedBooks.filter((book: PurchasedBook) => {
    const matchesPaymentMethod = paymentMethod === "all" || book.purchaseMethod.toLowerCase() === paymentMethod.toLowerCase();
    const matchesDate = !dateFilter || new Date(book.purchaseDate).toISOString().split("T")[0] === dateFilter;
    const matchesSearchTerm = 
      (!searchTerm || 
      book.bookIsbn.toString().includes(searchTerm) || 
      book.user.memberID.toString().includes(searchTerm));

    return matchesPaymentMethod && matchesDate && matchesSearchTerm;
  });

// Function to download filtered books as Excel
  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredBooks.map((book:PurchasedBook) => ({
      ISBN: book.bookIsbn,
      MemberID: book.user.memberID,
      PaymentMethod: book.purchaseMethod,
      Date: formatLendDate(book.purchaseDate)
    }))); 

    XLSX.utils.book_append_sheet(wb, ws, "Sold Books"); 
    XLSX.writeFile(wb, "sold_books.xlsx"); 
  };

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={paymentMethod}  onValueChange={setPaymentMethod}>
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
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-[180px]"
          />
          <Button className="w-full sm:w-auto" onClick={downloadExcel}>
            <Download className="mr-2 h-4 w-4" />
            Download Excel
          </Button>
        </div>
        {purchasedBooks && purchasedBooks.length > 0 ? (
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
              {filteredBooks?.map((book: PurchasedBook) => (
                <TableRow key={book.id}>
                  <TableCell className="md:table-cell hidden">{book.bookIsbn}</TableCell>
                  <TableCell>{book.user.memberID}</TableCell>
                  <TableCell>{book.purchaseMethod}</TableCell>
                  <TableCell className="md:table-cell hidden">{formatLendDate(book.purchaseDate)}</TableCell>
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
                            <p><strong>ISBN:</strong> {selectedSoldBook.bookIsbn}</p>
                            <p><strong>Member ID:</strong> {selectedSoldBook.user.memberID}</p>
                            <p><strong>Payment Method:</strong> {selectedSoldBook.purchaseMethod}</p>
                            <p><strong>Date:</strong> {formatLendDate(selectedSoldBook.purchaseDate)}</p>
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
              ): (<div className="text-xl font-black">Loading...</div>)}
      </CardContent>
    </Card>
  )
}