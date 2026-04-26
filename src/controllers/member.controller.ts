import { Request, Response } from "express";
import { T } from "../libs/types/common";

const memberController: T = {};
memberController.goHome = (req: Request, res: Response) => {
    try {
        res.send("You are on HomePage");
    } catch (error) {
        console.error("Error in goHome:", error);

    }
};

memberController.getLogin = (req: Request, res: Response) => {
    try {
        res.send("You are on LoginPage");
    } catch (error) {
        console.error("Error in getLogin:", error);

    }
};

memberController.getSignup = (req: Request, res: Response) => {
    try {
        res.send("You are on SignupPage");
    } catch (error) {
        console.error("Error in getSignup:", error);

    }
};

export default memberController;