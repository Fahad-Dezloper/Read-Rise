/* eslint-disable @typescript-eslint/no-unused-vars*/
"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Book {
  bookId: string;
  bookName: string;
  bookIsbn: number;
  lendEndDate: string;
  lendDate: string;
  userId: string;
  id: string;
  purchaseDate: string;
  purchaseMethod: string;
  amount: number;
}

type SaleBooks = {
  purchasedBooks: Book[]; // This array contains Book objects
};

type lendBooks = {
  lendBooks: Book[]; // This array contains Book objects
};

type User = {
  memberID: string;
  lendBooks: Book[]; // Define your Book type as necessary
  purchasedBooks: Book[];
  // other properties of User if necessary
};


// Lend
// fetch user lend books
const LendReturn = async (memberID: string) => {
  try {
    const response = await fetch(`/queries/fetchUserLendBooks?memberID=${memberID}`)
    if (!response.ok) {
      throw new Error('Failed to fetch data of user lend books')
    }
    const data = await response.json()
    // console.log('User Lend Books: ', data)
    return data
  } catch (error) {
    console.log(error)
  }
}

// update the book quantity to return
const UpdateBook = async (isbn: number) => { 
  // alert(`Lend Book ISBN is: ${isbn}`);
     try {
       const response = await fetch(`/queries/lendBookReturn?isbn=${isbn}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

       
    if (!response.ok) {
      throw new Error('Book not found');
    }
    const LendReturnbook = await response.json();
    // console.log("I am return book details update: ", LendReturnbook)
    return LendReturnbook;
     } catch (error) {
       console.log(error)
    alert("error fetching book data")
  }
}

// update user lend book model
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleReturnBook = async (lendBookId: any, userId: any) => {
  try {
    const response = await fetch(`/queries/UsersLendBooks?userId=${userId}&lendBookId=${lendBookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to return the book');
    }

    const updatedUser = await response.json();
    // console.log('Updated User after return:', updatedUser);

    // Update the UI after the book is returned (e.g., re-fetch the lendBooks data)
    // Call a function to refresh the lendBooks list or remove the returned book from the state.
  } catch (error) {
    console.error('Error returning book:', error);
  }
};

// Sale
const SaleReturn = async (memberID: string) => {
  try {
    const response = await fetch(`/queries/fetchUserPurchasedBooks?memberID=${memberID}`)
    if (!response.ok) {
      throw new Error('Failed to fetch data of user lend books')
    }
    const data = await response.json()
    // console.log('User Purchased Books: ', data)
    return data
  } catch (error) {
    console.log(error)
  }
}

// update user lend book model
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlePurchaseReturnBook = async (purchaseBookId: any, userId: any) => {
  try {
    const response = await fetch(`/queries/UsersPurchaseBooksReturn?userId=${userId}&purchaseBookId=${purchaseBookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to return the book');
    }

    const updatedUser = await response.json();
    // console.log('Updated User after return:', updatedUser);

    // Update the UI after the book is returned (e.g., re-fetch the lendBooks data)
    // Call a function to refresh the lendBooks list or remove the returned book from the state.
  } catch (error) {
    console.error('Error returning book:', error);
  }
};


// Filters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUpcomingReturns = (books: any[]) => {
  const today = new Date();
  return books.filter(book => {
    const dueDate = new Date(book.lendEndDate);
    const daysLeft = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24); // calculate days difference
    return daysLeft >= 0 && daysLeft <= 7; // due within the next 7 days
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getOverdueReturns = (books: any[]) => {
  const today = new Date();
  return books.filter(book => {
    const dueDate = new Date(book.lendEndDate);
    return dueDate < today; // past due date
  });
};


// Filters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortBooksByDueDate = (books: any[]) => {
  return books.sort((a, b) => {
    const dateA = new Date(a.lendEndDate);
    const dateB = new Date(b.lendEndDate);
    return dateA.getTime() - dateB.getTime();
  });
};




export function ReturnBookTabComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLendReturnDialogOpen, setIsLendReturnDialogOpen] = useState(false)
  const [isSaleReturnDialogOpen, setIsSaleReturnDialogOpen] = useState(false)
  const [memberId, setMemberId] = useState("")
  const [lendBooks, setlendBooks] = useState<lendBooks | null>(null)
  const [saleBooks, setSaleBooks] = useState<SaleBooks | null>(null)
  const [ user, setUser ] = useState(null);

  // fetch all the user who have lended books
    useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/queries/UsersLendBooks'); 
        // console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUser(data);
        // console.log("lend user:- ", user);
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
    }, []);


  useEffect(() => {
    if (memberId) {
      handleLendReturn(); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);
  
    // Lend
  // fetch unique user lended books
  const handleLendReturn = async () => {
    const response = await LendReturn(memberId);
    // console.log(`response of data: ${response}`)
    setlendBooks(response)
    // alert(`Book returned successfully!`)
  }


  // update return book on user and lend books model
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLendReturnButton = async (ISBN: number, userId: any, bookId: any) => {
    try {
      const bookUpdate = await UpdateBook(ISBN);
      const userUpdate = await handleReturnBook(bookId, userId)
      
      setlendBooks(null);
    } catch (err) {
      console.log(err)
    }
    // console.log(ISBN, userId, bookId)
    // console.log("book updated successfully");
    // alert("book updated successfully")
  }


  // Sale
   const handleSaleReturn = async () => {
    const response = await SaleReturn(memberId);
    // console.log(`response of data: ${response}`)
     setSaleBooks(response)
    //  console.log(saleBooks)
    // alert(`Book returned successfully!`)
   }
  
  // update return book on user and purchase books model
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSaleReturnButton = async (ISBN: number, userId: any, bookId: any) => {
    // console.log(ISBN, userId, bookId)
    const bookUpdate = await UpdateBook(ISBN);
    const userUpdate = await handlePurchaseReturnBook(bookId, userId)
    // console.log("book updated successfully");
    // alert("book updated successfully")
    }
  
  // format date
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

  // filtering function
const filteredLendBooks = () => {
  if (!user) return [];
  const books = (user as User[]).flatMap(u => 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    u.lendBooks.map((book: any) => ({
      ...book,
      memberID: u.memberID,
    }))
  );

  const sortedBooks = sortBooksByDueDate(books);

  switch (filterType) {
    case "upcoming":
      return getUpcomingReturns(sortedBooks);
    case "overdue":
      return getOverdueReturns(sortedBooks);
    default:
      return sortedBooks;
  }
};

  
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
                  {lendBooks ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Lend Books</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Book Name</TableHead>
                            <TableHead>ISBN</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Lend Date</TableHead>
                            <TableHead>Late Fees</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lendBooks.lendBooks?.map((book: Book) => (
                            <TableRow key={book.bookId}>
                              <TableCell>{book.bookName}</TableCell>
                              <TableCell>{book.bookIsbn}</TableCell>
                              <TableCell>{formatLendDate(book.lendEndDate)}</TableCell>
                              <TableCell>{formatLendDate(book.lendDate)}</TableCell>
                              <TableCell>$5</TableCell>
                              <TableCell>
                                <Button size="sm" onClick={() => handleLendReturnButton(book.bookIsbn, book.userId, book.id)}>Return</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ): ""}
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
                  <Button onClick={() => handleSaleReturn()}>Fetch</Button>
                  {saleBooks ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Bought Books</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Book Name</TableHead>
                            <TableHead>ISBN</TableHead>
                            <TableHead>Purchase Date</TableHead>
                            <TableHead>Purchase Method</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        {/* onClick={() => handleReturn()} */}
                        <TableBody>
                          {saleBooks.purchasedBooks.map((book: Book) => (
                            <TableRow key={book.id}>
                              <TableCell>{book.bookName}</TableCell>
                              <TableCell>{book.bookIsbn}</TableCell>
                              <TableCell>{book.purchaseDate}</TableCell>
                              <TableCell>{book.purchaseMethod}</TableCell>
                              <TableCell>{book.amount}</TableCell>
                              <TableCell>
                                <Button size="sm" onClick={() => handleSaleReturnButton(book.bookIsbn, book.userId, book.id)}>Return</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : ""}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="hidden md:block">
            <Tabs value={filterType} onValueChange={setFilterType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Lend Books</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming Returns</TabsTrigger>
                <TabsTrigger value="overdue">Overdue Returns</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="md:hidden">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter lend books" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lend Books</SelectItem>
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
                {filteredLendBooks().map(book => (
                    <TableRow key={book.id}>
                    <TableCell>{book.memberID}</TableCell>
                    {/* <TableCell>123456</TableCell> */}
                    <TableCell>{book.bookName}</TableCell>
                    <TableCell className="hidden md:table-cell">{book.bookIsbn}</TableCell>
                      <TableCell>{formatLendDate(book.lendEndDate)}</TableCell>
                    {/* <TableCell>${calculateLateFee(user.dueDate)}</TableCell> */}
                  </TableRow>  
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}