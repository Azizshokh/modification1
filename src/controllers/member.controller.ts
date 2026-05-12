import { Request, Response } from "express";
import { T } from "../libs/types/common";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import MemberService from "../models/Member.service";
import Errors, { HttpCode, Message } from "../libs/Error";
import AuthService from "../models/Auth.service";
import { AUTH_TIMER } from "../libs/config";

// REACT

const memberService = new MemberService();
const authService = new AuthService();

const memberController: T = {};

memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log("signup");
        const input: MemberInput = req.body;
        const result: Member = await memberService.signup(input);
        const token = await authService.createToken(result);

        res.cookie("accessToken", token, {
            maxAge: AUTH_TIMER * 3600 * 1000,
            httpOnly: false
        });

        res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
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
        const token = await authService.createToken(result);

        res.cookie("accessToken", token, {
            maxAge: AUTH_TIMER * 3600 * 1000,
            httpOnly: false
        });

        res.status(HttpCode.OK).json({ member: result, accessToken: token });
    } catch (error) {
        console.error("Error in login:", error);
        if (error instanceof Errors) res.status(error.code).json(error);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

memberController.verifyAuth = async (req: Request, res: Response) => {
    try {
        let member = null;
        const token = req.cookies["accessToken"];
        if (token) member = await authService.checkAuth(token);

        if (!member) throw new Errors(HttpCode.UNAUTHORIZED, Message.CREATE_FAILED);

        res.status(HttpCode.OK).json({ member: member });
    } catch (error) {
        console.error("Error in verifyAuth:", error);
        if (error instanceof Errors) res.status(error.code).json(error);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}

export default memberController;