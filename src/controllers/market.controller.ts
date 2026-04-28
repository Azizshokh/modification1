import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { Message } from "../libs/Error";

const memberService = new MemberService();
const marketController: T = {};
marketController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome");
        res.render("home");
    } catch (error) {
        console.error("Error in goHome:", error);
        res.redirect("/admin");
    }
};

marketController.getLogin = (req: Request, res: Response) => {
    try {
        res.render("login");
    } catch (error) {
        console.error("Error in getLogin:", error);
        res.redirect("/admin");
    }
};

marketController.getSignup = (req: Request, res: Response) => {
    try {
        res.render("signup");
    } catch (error) {
        console.error("Error in getSignup:", error);
        res.redirect("/admin");
    }
};

marketController.proccesSignup = async (req: AdminRequest, res: Response) => {
    try {
        console.log("proccesSignup");
        console.log("body:", req.body);

        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.ADMIN;

        const result = await memberService.proccessSignup(newMember);
        //TODO: SESSIONS Authenticate
        req.session.member = result;
        req.session.save(function () {
            res.send(result);
        });
    } catch (error) {
        console.error("Error in proccesSignup:", error);
        const message = error instanceof Errors ? error.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}"); window.location.replace("/admin/signup");</script>`);
    }
};

marketController.proccesLogin = async (req: AdminRequest, res: Response) => {
    try {
        const input: LoginInput = req.body;
        const result = await memberService.proccessLogin(input);

        //TODO: SESSIONS Authenticate
        req.session.member = result;
        req.session.save(function () {
            res.send(result);
        });
    } catch (error) {
        console.error("Error in proccesLogin:", error);
        const message = error instanceof Errors ? error.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}"); window.location.replace("/admin/login");</script>`);
    }
};

marketController.logout = (req: AdminRequest, res: Response) => {
    try {
        req.session.destroy(function () {
            res.redirect("/admin/login");
        });
    } catch (error) {
        console.error("Error in logout:", error);
        const message = error instanceof Errors ? error.message : Message.NOT_AUTHENTICATED;
        res.redirect("/admin");
    }
};

marketController.checkAuthSession = (req: AdminRequest, res: Response) => {
    try {
        if (req.session?.member) res.send(`<script>alert("Hi, ${req.session.member.memberNick}!");</script>`);
        else res.send(`<script>alert("${Message.NOT_AUTHENTICATED}"); window.location.replace("/admin/login");</script>`);
    } catch (error) {
        console.error("Error in checkAuthSession:", error);
        const message = error instanceof Errors ? error.message : Message.NOT_AUTHENTICATED;
        res.send(`<script>alert("${message}"); window.location.replace("/admin/login");</script>`);
    }
};

export default marketController;