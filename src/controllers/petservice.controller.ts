import { Request, Response } from "express";
import { T } from "../libs/types/common";
import { ExtendedRequest } from "../libs/types/member";
import { PetServiceInput, PetServiceUpdateInput } from "../libs/types/petservice";
import PetServiceService from "../models/Petservice.service";
import Errors from "../libs/Error";

const petServiceService = new PetServiceService();
const petServiceController: T = {};

/*** SPA ***/

petServiceController.getAvailableSlots = async (req: Request, res: Response) => {
    try {
        const { serviceDate } = req.query;
        const result = await petServiceService.getAvailableSlots(new Date(serviceDate as string));

        res.json({ slots: result });
    } catch (error) {
        console.error("Error in getAvailableSlots:", error);
        if (error instanceof Errors) res.status(error.code).json(error);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

petServiceController.createPetService = async (req: Request, res: Response) => {
    try {
        const input: PetServiceInput = req.body;
        const result = await petServiceService.createPetService(input);

        res.json({ petService: result });
    } catch (error) {
        console.error("Error in createPetService:", error);
        if (error instanceof Errors) res.status(error.code).json(error);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

petServiceController.getMyPetServices = async (req: Request, res: Response) => {
    try {
        const memberId = req.params.memberId as string;
        const result = await petServiceService.getMyPetServices(memberId);

        res.json({ petServices: result });
    } catch (error) {
        console.error("Error in getMyPetServices:", error);
        if (error instanceof Errors) res.status(error.code).json(error);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

petServiceController.getMyAuthenticatedPetServices = async (req: ExtendedRequest, res: Response) => {
    try {
        const memberId = String(req.member._id);
        const result = await petServiceService.getMyPetServices(memberId);

        res.set("Cache-Control", "no-store");
        res.json({ petServices: result });
    } catch (error) {
        console.error("Error in getMyAuthenticatedPetServices:", error);
        if (error instanceof Errors) res.status(error.code).json(error);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

petServiceController.cancelPetService = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const memberId = req.body.memberId as string;
        const result = await petServiceService.cancelPetService(id, memberId);

        res.json({ petService: result });
    } catch (error) {
        console.error("Error in cancelPetService:", error);
        if (error instanceof Errors) res.status(error.code).json(error);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

/*** SSR (Admin) ***/

petServiceController.getAllPetServices = async (req: Request, res: Response) => {
    try {
        const inquiry = req.query;
        const result = await petServiceService.getAllPetServices(inquiry as any);

        res.render("petservices", { petServices: result });
    } catch (error) {
        console.error("Error in getAllPetServices:", error);
        if (error instanceof Errors) res.status(error.code).json(error);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

petServiceController.updateChosenPetService = async (req: Request, res: Response) => {
    try {
        const input: PetServiceUpdateInput = req.body;
        const result = await petServiceService.updateChosenPetService(input);

        res.json({ petService: result });
    } catch (error) {
        console.error("Error in updateChosenPetService:", error);
        if (error instanceof Errors) res.status(error.code).json(error);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

export default petServiceController;
