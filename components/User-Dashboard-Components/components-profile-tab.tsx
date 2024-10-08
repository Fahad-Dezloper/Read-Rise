'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {useRouter} from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useState } from 'react';
import { useUser } from '@/app/UserContext';
import { User } from '@/shared/usertypes'

export function ProfileTab() {
  const router = useRouter(); // Initialize the router
  const { user, setUser } = useUser();
  const [name, setName] = useState<string>(user?.name || '')
  const [phoneNumber, setphoneNumber] = useState<string>(user?.phoneNumber || '')

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put('/queries/user', {
        email: user.email,
        name,
        phoneNumber
      });
      console.log("User Updates", response.data);
      setUser({ ...user, name: response.data.name, phoneNumber: response.data.phoneNumber });
      router.refresh(); 
      } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar || '/placeholder.svg?height=100&width=100'} alt={ name || 'User'} />
            <AvatarFallback>{name ? name.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{name || 'User'}</h2>
            <p className="text-gray-500">{user?.email || 'No email provided'}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} 
  onChange={(e) => setName(e.target.value)} />
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
          <Input id="phoneNumber" onChange={(e) => setphoneNumber(e.target.value)} defaultValue={phoneNumber || ''} />
        </div>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </CardContent>
    </Card>
  )
}