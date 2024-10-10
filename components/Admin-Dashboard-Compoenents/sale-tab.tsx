'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SaleTabComponent() {
  const [isbn, setIsbn] = useState("")
  const [memberId, setMemberId] = useState("")
  const [lendDays, setLendDays] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [saleType, setSaleType] = useState("")

  const handleLendBook = () => {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + parseInt(lendDays))
    alert(`Book lent to Member ${memberId} until ${expiryDate.toLocaleDateString()}`)
  }

  const handleSaleBook = () => {
    alert(`Book sold to Member ${memberId}. Payment method: ${paymentMethod}`)
  }

  return (
    <Card className="md:rounded-lg rounded-none">
      <CardHeader>
        <CardTitle>Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Input
              id="isbn"
              placeholder="Enter ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setSaleType("lend")}>Lend</Button>
            <Button onClick={() => setSaleType("sale")}>Sale</Button>
          </div>
          {saleType === "lend" && (
            <div className="space-y-4">
              <Input
                placeholder="Member ID"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              />
              <p>Current Date: {new Date().toLocaleDateString()}</p>
              <Input
                type="number"
                placeholder="Number of days"
                
                value={lendDays}
                onChange={(e) => setLendDays(e.target.value)}
              />
              {lendDays && (
                <p>Expiry Date: {new Date(Date.now() + parseInt(lendDays) * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              )}
              <Button onClick={handleLendBook}>Lend</Button>
            </div>
          )}
          {saleType === "sale" && (
            <div className="space-y-4">
              <Input
                placeholder="Member ID"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              />
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSaleBook}>Sale</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}