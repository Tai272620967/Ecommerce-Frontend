export interface User {
  id: number;
  firstName: string;
  lastName: string;
  kataFirstName?: string;
  kataLastName?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  phone?: string;
  birthday?: string;
  email: string;
  gender?: string;
  role?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: User[];
}

export interface UserResponse {
  data: User;
}

