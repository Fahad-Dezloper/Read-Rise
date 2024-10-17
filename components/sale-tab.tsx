"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Mock function to fetch book details
const fetchBookDetails = (isbn) => {
  // In a real application, this would be an API call
  return {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780446310789",
    quantity: 5,
    imageUrl: "/placeholder.svg"
  }
}

export function SaleTabComponent() {
  const [isbn, setIsbn] = useState("")
  const [memberId, setMemberId] = useState("")
  const [lendDays, setLendDays] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [saleType, setSaleType] = useState("")
  const [bookDetails, setBookDetails] = useState(null)

  const handleIsbnSubmit = () => {
    if (isbn) {
      const details = fetchBookDetails(isbn)
      setBookDetails(details)
    }
  }

  const handleLendBook = () => {
    if (!bookDetails) return
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + parseInt(lendDays))
    alert(`Book "${bookDetails.title}" lent to Member ${memberId} until ${expiryDate.toLocaleDateString()}`)
  }

  const handleSaleBook = () => {
    if (!bookDetails) return
    alert(`Book "${bookDetails.title}" sold to Member ${memberId}. Payment method: ${paymentMethod}`)
  }

  return (
    <Card className="md:rounded-lg rounded-none">
      <CardHeader>
        <CardTitle>Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="isbn">ISBN</Label>
            <div className="flex space-x-2">
              <Input
                id="isbn"
                placeholder="Enter ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
              <Button onClick={handleIsbnSubmit}>Submit</Button>
            </div>
          </div>
          {bookDetails && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Image
                  src={bookDetails.imageUrl}
                  alt={bookDetails.title}
                  width={200}
                  height={300}
                  className="w-full h-auto"
                />
                <div>
                  <h3 className="text-lg font-semibold">{bookDetails.title}</h3>
                  <p>Author: {bookDetails.author}</p>
                  <p>ISBN: {bookDetails.isbn}</p>
                  <p>Quantity: {bookDetails.quantity}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSaleType("lend")}>Lend</Button>
                  <Button onClick={() => setSaleType("sale")}>Sale</Button>
                </div>
                {saleType === "lend" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="memberId">Member ID</Label>
                      <Input
                        id="memberId"
                        placeholder="Member ID"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentDate">Current Date</Label>
                      <Input
                        id="currentDate"
                        value={new Date().toLocaleDateString()}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lendDays">Number of days</Label>
                      <Input
                        id="lendDays"
                        type="number"
                        placeholder="Number of days"
                        value={lendDays}
                        onChange={(e) => setLendDays(e.target.value)}
                      />
                    </div>
                    {lendDays && (
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={new Date(Date.now() + parseInt(lendDays) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          disabled
                        />
                      </div>
                    )}
                    <Button onClick={handleLendBook}>Lend</Button>
                  </div>
                )}
                {saleType === "sale" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="memberId">Member ID</Label>
                      <Input
                        id="memberId"
                        placeholder="Member ID"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger id="paymentMethod">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaleBook}>Sale</Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}