export interface AuthUser {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  avatar: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput extends LoginInput {
  name: string;
}
