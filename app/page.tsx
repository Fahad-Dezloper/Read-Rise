import React from 'react'
import UserComponent from './components/UserComponent'
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

const page = async () => {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user.email; 
  return ( 
    <div className="flex w-full h-screen items-center justify-center">
      <h1 className='text-3xl font-semibold font-mono pb-11'>R2 Library Management System</h1>
      <UserComponent email={userEmail} />
    </div>
  )
}

export default page