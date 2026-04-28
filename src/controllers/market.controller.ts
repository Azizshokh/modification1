import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";

const memberService = new MemberService();
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

marketController.proccesSignup = async (req: Request, res: Response) => {
    try {
        console.log("proccesSignup");
        console.log("body:", req.body);

        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.ADMIN;

        const result = await memberService.proccessSignup(newMember);
        //TODO: SESSIONS Authenticate

        res.send(result);
    } catch (error) {
        console.error("Error in proccesSignup:", error);
    }
};

marketController.proccesLogin = async (req: Request, res: Response) => {
    try {
        const input: LoginInput = req.body;
        const result = await memberService.proccessLogin(input);

        //TODO: SESSIONS Authenticate

        res.send(result);
    } catch (error) {
        console.error("Error in proccesLogin:", error);
        res.send(error);
    }
};


export default marketController;