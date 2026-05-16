import { ExtendedRequest } from "../libs/types/member";
import { T } from "../libs/types/common";
import { Response } from "express";
import Errors, { HttpCode } from "../libs/Error";
import OrderService from "../models/Order.service";

const orderService = new OrderService();
const orderController: T = {};

orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
    try {
        const result = await orderService.createOrder(req.member, req.body);

        res.status(HttpCode.CREATED).json(result);
    } catch (error) {
        console.error("Error in createOrder:", error);
        if (error instanceof Errors) {
            res.status(error.code).json(error);
        } else {
            res.status(Errors.standard.code).json(Errors.standard);
        }
    }
};

export default orderController;