import { UserDashboardMain } from '@/components/Main-Dashboards/user-dashboard';
import React from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const page = async () => {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user.email; 
  return (
      <div>
          <UserDashboardMain email = {userEmail} />
    </div>
  )
}

export default page