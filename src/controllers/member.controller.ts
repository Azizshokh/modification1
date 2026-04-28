import { Request, Response } from "express";
import { T } from "../libs/types/common";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import MemberService from "../models/Member.service";
import Errors from "../libs/Error";

// REACT

const memberService = new MemberService();
const memberController: T = {};

memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log("signup");
        const input: MemberInput = req.body;
        const result: Member = await memberService.signup(input);
        // TODO: TOKEN

        res.json({ member: result });
    } catch (error) {
        console.error("Error in signup:", error);
        if (error instanceof Errors) res.status(error.code).json(error);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

memberController.login = async (req: Request, res: Response) => {
    try {
        console.log("login");
        const input: LoginInput = req.body;
        const result = await memberService.login(input);
        // TODO: TOKEN

        res.json({ member: result });
    } catch (error) {
        console.error("Error in login:", error);
        if (error instanceof Errors) res.status(error.code).json(error);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

export default memberController;