'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ProfileTabProps {
  user: {
    name: string;
    email: string;
    memberId: string;
    phoneNumber: string;
    avatar: string;
  };
}

export function ProfileTab({ user }: ProfileTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar || '/placeholder.svg?height=100&width=100'} alt={user?.name || 'User'} />
            <AvatarFallback>{user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
            <p className="text-gray-500">{user?.email || 'No email provided'}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue={user?.name || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue={user?.email || ''} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="memberId">Member ID</Label>
          <Input id="memberId" defaultValue={user?.memberId || ''} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" defaultValue={user?.phoneNumber || ''} />
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  )
}