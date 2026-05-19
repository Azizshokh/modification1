import PetServiceModel from "../schema/Petservice.model";
import {
    PetService,
    PetServiceInput,
    PetServiceInquiry,
    PetServiceUpdateInput,
} from "../libs/types/petservice";
import Errors, { HttpCode, Message } from "../libs/Error";
import { PetServiceStatus } from "../libs/enums/petservice.enum";
import { shapeIntoMongooseObjectId } from "../libs/config";

class PetServiceService {
    private readonly petServiceModel;

    constructor() {
        this.petServiceModel = PetServiceModel;
    }

    /*** SPA ***/

    /** Check if a given date+time slot is already booked */
    public async checkSlotAvailability(serviceDate: Date, serviceTime: string): Promise<boolean> {
        // Normalize to start-of-day so time comparison is clean
        const dayStart = new Date(serviceDate);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(serviceDate);
        dayEnd.setHours(23, 59, 59, 999);

        const existing = await this.petServiceModel
            .findOne({
                serviceDate: { $gte: dayStart, $lte: dayEnd },
                serviceTime: serviceTime,
            })
            .exec();

        return !existing; // true = slot is free
    }

    /** Book a vegetarian service slot */
    public async createPetService(input: PetServiceInput): Promise<PetService> {
        try {
            // Pre-flight validation so the caller gets a clear reason
            const required: (keyof PetServiceInput)[] = [
                "memberId",
                "petName",
                "petType",
                "serviceType",
                "serviceLocation",
                "serviceAddress",
                "serviceDate",
                "serviceTime",
            ];
            const missing = required.filter((k) => input[k] === undefined || input[k] === null || input[k] === "");
            if (missing.length) {
                console.error("createPetService missing fields:", missing, "received body:", input);
                throw new Errors(HttpCode.BAD_REQUEST, `Missing required fields: ${missing.join(", ")}` as unknown as Message);
            }

            const memberId = shapeIntoMongooseObjectId(input.memberId);

            const isAvailable = await this.checkSlotAvailability(
                input.serviceDate,
                input.serviceTime
            );
            if (!isAvailable) {
                throw new Errors(HttpCode.BAD_REQUEST, Message.SLOT_ALREADY_TAKEN);
            }

            const result = await this.petServiceModel.create({
                ...input,
                memberId,
            });
            return result.toJSON();
        } catch (error) {
            // Surface the underlying cause instead of hiding it
            console.error("createPetService underlying error:", error);

            // Don't re-wrap our own typed errors (e.g. SLOT_ALREADY_TAKEN, missing-fields)
            if (error instanceof Errors) throw error;

            const mongoError = error as { code?: number; name?: string; message?: string };
            if (mongoError?.code === 11000) {
                throw new Errors(HttpCode.BAD_REQUEST, Message.SLOT_ALREADY_TAKEN);
            }
            // Bubble the real Mongoose/BSON message up to the HTTP response
            const detail = mongoError?.message || "Unknown error";
            throw new Errors(HttpCode.BAD_REQUEST, `${Message.CREATE_FAILED} (${detail})` as unknown as Message);
        }
    }

    /** Get all services for the authenticated member */
    public async getMyPetServices(memberId: string): Promise<PetService[]> {
        const id = shapeIntoMongooseObjectId(memberId);
        const result = await this.petServiceModel
            .find({ memberId: id })
            .sort({ updatedAt: -1 })
            .lean()
            .exec();
        return (result || []) as PetService[];
    }

    /** Get available (free) time slots for a given day */
    public async getAvailableSlots(serviceDate: Date): Promise<string[]> {
        const ALL_SLOTS = [
            "09:00", "10:00", "11:00",
            "12:00", "13:00", "14:00", "15:00",
            "16:00", "17:00",
        ];

        const dayStart = new Date(serviceDate);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(serviceDate);
        dayEnd.setHours(23, 59, 59, 999);

        const bookedSlots = await this.petServiceModel
            .find({
                serviceDate: { $gte: dayStart, $lte: dayEnd },
            })
            .select("serviceTime")
            .lean()
            .exec();

        const bookedTimes = bookedSlots.map((s: any) => s.serviceTime);
        return ALL_SLOTS.filter((slot) => !bookedTimes.includes(slot));
    }

    /** Cancel a service (member's own) — hard-deletes since there is no
     *  CANCELLED status anymore. Only allowed while still in PAUSE. */
    public async cancelPetService(serviceId: string, memberId: string): Promise<PetService> {
        const id = shapeIntoMongooseObjectId(serviceId);
        const mId = shapeIntoMongooseObjectId(memberId);

        const result = await this.petServiceModel
            .findOneAndDelete({
                _id: id,
                memberId: mId,
                serviceStatus: PetServiceStatus.PAUSE,
            })
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        return result as PetService;
    }

    /*** SSR (Admin) ***/

    /** Get all services — optionally filtered */
    public async getAllPetServices(inquiry: PetServiceInquiry): Promise<PetService[]> {
        const match: Record<string, any> = {};

        if (inquiry.serviceDate) {
            const dayStart = new Date(inquiry.serviceDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(inquiry.serviceDate);
            dayEnd.setHours(23, 59, 59, 999);
            match.serviceDate = { $gte: dayStart, $lte: dayEnd };
        }
        if (inquiry.petType) match.petType = inquiry.petType;
        if (inquiry.memberId) match.memberId = shapeIntoMongooseObjectId(inquiry.memberId);

        const result = await this.petServiceModel
            .find(match)
            .populate('memberId', 'memberNick memberPhone')
            .lean()
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        return result as PetService[];
    }

    /** Admin update (status, time, date) */
    public async updateChosenPetService(input: PetServiceUpdateInput): Promise<PetService> {
        const id = shapeIntoMongooseObjectId(input._id);

        // If admin is rescheduling, re-check slot availability
        if (input.serviceDate && input.serviceTime) {
            const isAvailable = await this.checkSlotAvailability(
                input.serviceDate,
                input.serviceTime
            );
            if (!isAvailable) throw new Errors(HttpCode.BAD_REQUEST, Message.SLOT_ALREADY_TAKEN);
        }

        const result = await this.petServiceModel
            .findByIdAndUpdate({ _id: id }, input, { new: true })
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        return result;
    }
}

export default PetServiceService;