import { User } from "./User";

export interface AuthData {
    token: string;
    user: User;
}

export interface RegistrationCompleteModel {
    userId: string;
}