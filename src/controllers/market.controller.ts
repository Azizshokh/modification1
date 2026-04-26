import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";

const marketController: T = {};
marketController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome");
        res.send("You are on HomePage");
    } catch (error) {
        console.error("Error in goHome:", error);

    }
};

marketController.getLogin = (req: Request, res: Response) => {
    try {
        res.send("You are on LoginPage");
    } catch (error) {
        console.error("Error in getLogin:", error);

    }
};

marketController.getSignup = (req: Request, res: Response) => {
    try {
        res.send("You are on SignupPage");
    } catch (error) {
        console.error("Error in getSignup:", error);

    }
};

marketController.proccesLogin = (req: Request, res: Response) => {
    try {
        res.send("You are on proccesLoginPage");
    } catch (error) {
        console.error("Error in proccesLogin:", error);

    }
};

marketController.proccesSignup = (req: Request, res: Response) => {
    try {
        res.send("You are on proccesSignupPage");
    } catch (error) {
        console.error("Error in proccesSignup:", error);

    }
};

export default marketController;