import mongoose, { Schema } from "mongoose";
import { PetServiceLocation, PetServiceStatus, PetServiceType, PetType } from "../libs/enums/petservice.enum";

const petServiceSchema = new Schema(
    {
        memberId: {
            type: Schema.Types.ObjectId,
            ref: "Member",
            required: true,
        },
        petName: {
            type: String,
            required: true,
        },
        petType: {
            type: String,
            enum: PetType,
            required: true,
        },
        serviceType: {
            type: String,
            enum: PetServiceType,
            required: true,
        },
        serviceStatus: {
            type: String,
            enum: PetServiceStatus,
            default: PetServiceStatus.PAUSE,
        },
        serviceDate: {
            type: Date,
            required: true,
        },
        serviceTime: {
            type: String,
            required: true,
        },
        specialNote: {
            type: String,
        },
        serviceAddress: {
            type: String,
            required: true,
        },
        serviceLocation: {
            type: String,
            enum: PetServiceLocation,
            required: true,
        },
    },
    { timestamps: true }
);

petServiceSchema.index(
    { serviceDate: 1, serviceTime: 1 },
    { unique: true, sparse: true }
);

export default mongoose.model("PetService", petServiceSchema);