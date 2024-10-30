"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"



// Lend
// fetch book details from the API
const fetchBookDetails = async (isbn) => {
  try {
    const response = await fetch(`/queries/books?isbn=${isbn}`)
    if (!response.ok) {
      throw new Error('Book not found');
    }
    const book = await response.json();
    // console.log(book)
    return book;
  } catch (error) {
    console.log("error fetching book data", error)
  }
}
// reduce the book quantity
const handleIsbnlendBook = async (isbn, quantity) => { 
  // alert(`Lend Book ISBN is: ${isbn}`);
     try {
       const response = await fetch(`/queries/lendBooks?isbn=${isbn}&quantity=${Number(quantity)}`, {
      method: 'PUT', // use PUT method
      headers: {
        'Content-Type': 'application/json',
      },
    });

       
    if (!response.ok) {
      throw new Error('Book not found');
    }
    const Lendbook = await response.json();
    // console.log("I am lend book details update: ", Lendbook)
    return Lendbook;
  } catch (error) {
    console.log("error fetching book data", error)
  }
} 
// Add the ISBN to the user lend books array
const addLendIsbntoUser = async (isbn, memberId, lendDays) => {
  // alert(`Update User Lend Books with ISBN: ${isbn}`)

  try {
    const response = await fetch(`/queries/updateUserLend?isbn=${isbn}&memberId=${memberId}&lendDays=${Number(lendDays)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('User not found');
    }
    const Lenduser = await response.json();
    // console.log("I am Lend User Details", Lenduser)
    return Lenduser;
  } catch (error) {
    console.log("Error Updating User", error)
  }
}

// Sale
// Add the ISBN to the user Purchase Books Array
const UserSaleModelUpdate = async (isbn, memberId, price, paymentMethod) => {
  try {
    const response = await fetch(`/queries/updateUserPurchase?isbn=${isbn}&memberId=${memberId}&price=${Number(price)}&paymentMethod=${paymentMethod}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('User not found');
    }
    const PurchaseUser = await response.json();
    // console.log("I am purchase User Details", PurchaseUser)
    return PurchaseUser;
  } catch (error) {
    console.log("Error Updating User", error)
  } 
}


export function SaleTabComponent() {
  const [isbn, setIsbn] = useState("")
  const [memberId, setMemberId] = useState("")
  const [lendDays, setLendDays] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [saleType, setSaleType] = useState("")
  const [bookDetails, setBookDetails] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(bookDetails ? bookDetails.Price : '')

  const [loading, setLoading] = useState(false)

  // Lend
  const handleIsbnSubmit = async () => {
    setLoading(true);
    if (isbn) {
      const details = await fetchBookDetails(isbn)
      setBookDetails(details)
      setLoading(false);
    }
  }

  const handleLendBook = async () => {
    setLoading(true);

    try {
      if (!bookDetails || !memberId) {
        alert('MEMBER ID is required');
        setLoading(false);
        return;
      }

      if (isbn) {
        const lendBookDet = await handleIsbnlendBook(isbn, quantity);
        const userUpdate = await addLendIsbntoUser(isbn, memberId, lendDays);

        // Reset states after successful operation
        setIsbn("");
        setMemberId("");
        setLendDays("");
        setQuantity(1);
        setBookDetails(null);
      } else {
        alert('ISBN is required');
      }
    } catch (error) {
      console.error('Error in lending book:', error);
    } finally {
      setLoading(false);
    }
  }

  // price
  useEffect(() => {
  if (bookDetails) {
    setPrice(bookDetails.Price);
  }
}, [bookDetails]);

  // Sale
  const handleSaleBook = async () => {
     setLoading(true)
    try {
      if (!bookDetails || !memberId || !paymentMethod || !price) {
        alert('MEMBER ID & Payment Method & Price is required');
        setLoading(false);
        return;
      }

      if (isbn) {
        const updateBookqt = await handleIsbnlendBook(isbn, quantity);
        const userUpdate = await UserSaleModelUpdate(isbn, memberId, price, paymentMethod);

        setLoading(false);
        // Reset states after successful operation
        setIsbn("");
        setMemberId("");
        setQuantity(1);
        setPrice(null);
        setPaymentMethod(null);
        setBookDetails(null);
      } else {
        alert('ISBN is required');
      }
    } catch (error) {
      console.error('Error in lending book:', error);
    } finally {
      setLoading(false);
    }
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
              <Button onClick={handleIsbnSubmit} disabled={loading == true}>{loading ? 'Fetching Details' : 'Submit'}</Button>
            </div>
          </div>
          {bookDetails ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 mt-12">
                <Image
                  src={bookDetails.Images[0].url}
                  alt={bookDetails.BookName}
                  width={150}
                  height={150}
                  className="rounded-md h-fit"
                />
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold font-inter">{bookDetails.BookName}</h3>
                  <p>Author: {bookDetails.Author}</p>
                  <p>ISBN: {bookDetails.ISBN}</p>
                  <p>Quantity: {bookDetails.Quantity}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" disabled={bookDetails.Quantity <= 0} onClick={() => setSaleType("lend")}>Lend</Button>
                  <Button onClick={() => setSaleType("sale")} disabled={bookDetails.Quantity <= 0}>Sale</Button>
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
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleLendBook} disabled={loading == true}>{ loading ? 'Lending' : 'Lend'}</Button>
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
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Price of the Book</Label>
                      <Input
                        id="amount"
                        placeholder="Price"
                        value={price}
                        type="number"
                        onChange={(e) => setPrice(e.target.value)}
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
                    <Button onClick={() => handleSaleBook()} disabled={loading == true}>{loading ? 'Selling' : 'Sale'}</Button>
                  </div>
                )}
              </div>
            </div>
          ) : "Book Not Found"}
        </div>
      </CardContent>
    </Card>
  )
}