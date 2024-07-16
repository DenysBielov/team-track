export interface UserCreate {
  name: string;
  surname: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface GoogleUserCreate {
  name: string;
  email: string;
  image: string;
}

export interface Suspension {
  active: boolean;
  reason: string;
}