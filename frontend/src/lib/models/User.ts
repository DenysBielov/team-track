export interface BaseUser {
  email: string;
  password: string;
}

export interface User extends BaseUser {
  id: string;
}

export interface GoogleUserCreate {
  name: string;
  email: string;
  image: string;
}

export interface Profile {
  user: User;
  name: string;
  surname: string;
  avatar?: string;
}

export interface Suspension {
  active: boolean;
  reason: string;
}