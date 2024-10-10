export interface User {
  name: string;
  email: string;
  memberId?: string;
  phoneNumber?: string;
  avatar?: string;
}

// types.ts
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  memberId?: string;
  phoneNumber?: string;
  avatar?: string;
}