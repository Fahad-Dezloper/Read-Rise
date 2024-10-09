'use client'

import Image from "next/image"
import { CalendarIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {useUser} from "@/app/UserContext"

interface HomeTabProps {
  lentBooks?: Array<{
    id: number;
    name: string;
    image: string;
    returnDate: string;
  }>;
  onTabChange: (tab: string) => void;
}

interface User{
    name: string;
    email: string;
    memberID?: string;
    avatar?: string;
    subscription: {
      planType: string;
      status: string;
      startDate: Date;
      endDate: Date;
    };
  };

export function HomeTab({ lentBooks, onTabChange }: HomeTabProps) {
  const { user }: User = useUser();
  if (!user) {
    return <p>Loading user details...</p>;
  }
  console.log("i am user", user)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {user?.name || 'User'}!</CardTitle>
        <CardDescription>Here&apos;s an overview of your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar || '/placeholder.svg?height=100&width=100'} alt={user?.name || 'User'} />
            <AvatarFallback>{user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{user?.name || 'User'}</h2>
            <p className="text-gray-500">{user?.email || 'No email provided'}</p>
            <p className="text-gray-500">Member ID: {user?.memberID || 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Subscription</h3>
            <Card>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <p className="font-semibold">{user.subscription?.planType}</p>
                  <p className="text-sm text-gray-500">Valid until: {new Date(user.subscription?.endDate).toLocaleDateString()}</p>
                </div>
                <Badge variant="secondary">{user.subscription?.status}</Badge>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Books Lent</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(lentBooks || []).slice(0, 3).map((book) => (
                <Card key={book.id}>
                  <CardContent className="flex items-center space-x-4 p-4">
                    <Image src={book.image} alt={book.name} width={60} height={80} className="object-cover" />
                    <div>
                      <p className="font-medium">{book.name}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        Return by: {book.returnDate}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {(lentBooks || []).length > 3 && (
              <Button variant="link" className="mt-2" onClick={() => onTabChange("books")}>
                View all lent books
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}