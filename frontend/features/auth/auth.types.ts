export interface AuthUser {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  avatar: string | null;
  createdAt: string;
}

export interface UpdateProfileInput {
  name: string;
  avatar: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput extends LoginInput {
  name: string;
}
