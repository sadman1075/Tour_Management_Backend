import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}

export interface IAuthProvider{
    provider:string;
    providerId:string;
}

export enum IsActive{
    ACTIVE="ACTIVE",
    INACTIVE="INACTIVE",
    BLOCKED="BLOCKED"
}


export interface IUser {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: string;
    isActive?: IsActive;
    isVerified?: string;
    role: Role;
    auth:IAuthProvider[];
    bookings?:Types.ObjectId[]
    guide?:Types.ObjectId[]

}