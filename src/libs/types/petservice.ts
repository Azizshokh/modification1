import { PetServiceLocation, PetServiceStatus, PetServiceType, PetType } from "../enums/petservice.enum";

export interface PetServiceInput {
    memberId: string;
    petName: string;
    petType: PetType;
    serviceType: PetServiceType;
    serviceLocation: PetServiceLocation;
    serviceAddress: string;
    serviceDate: Date;
    serviceTime: string;
    specialNote?: string;
}

export interface PetService {
    _id: string;
    memberId: string | { _id: string; memberNick: string; memberPhone: string };
    petName: string;
    petType: PetType;
    serviceType: PetServiceType;
    serviceLocation: PetServiceLocation;
    serviceStatus: PetServiceStatus;
    serviceDate: Date;
    serviceTime: string;
    serviceAddress: string;
    specialNote?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PetServiceUpdateInput {
    _id: string;
    serviceStatus?: PetServiceStatus;
    serviceType?: PetServiceType;
    serviceLocation?: PetServiceLocation;
    serviceAddress?: string;
    serviceDate?: Date;
    serviceTime?: string;
    specialNote?: string;
}

export interface PetServiceInquiry {
    serviceDate?: Date;
    petType?: PetType;
    memberId?: string;
}