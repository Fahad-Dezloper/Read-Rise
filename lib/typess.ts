/* eslint-disable @typescript-eslint/no-explicit-any */
// types.ts
export interface Subscription {
  id: string;
  userId: string;
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface User {
  purchasedBooks?: any;
  lendBooks?: any;
  name: string;
  email: string;
  memberID?: string;
  phoneNumber?: string;
  avatar?: string;
  subscription?: Subscription | null; // Ensure it's consistent
}
