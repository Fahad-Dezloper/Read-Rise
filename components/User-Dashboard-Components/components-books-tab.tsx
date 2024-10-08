'use client'

import Image from "next/image"
import { CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Book {
  id: number;
  name: string;
  isbn: string;
  image: string;
  returnDate?: string;
  issueDate?: string;
  boughtOn?: string;
  author: string;
}

interface BooksTabProps {
  lentBooks: Book[];
  boughtBooks: Book[];
}

export function BooksTab({ lentBooks, boughtBooks }: BooksTabProps) {
  return (
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
              {(lentBooks || []).map((book) => (
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
                        <p>ISBN:  {book.isbn}</p>
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
              {(boughtBooks || []).map((book) => (
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
  )
}