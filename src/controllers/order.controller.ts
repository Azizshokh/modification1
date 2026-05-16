import { ExtendedRequest } from "../libs/types/member";
import { T } from "../libs/types/common";
import { Response } from "express";
import Errors, { HttpCode } from "../libs/Error";
import OrderService from "../models/Order.service";
import { OrderInquiry, OrderUpdateInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";

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

orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
    try {
        const { page, limit, orderStatus } = req.query;
        const inquiry: OrderInquiry = {
            page: Number(page),
            limit: Number(limit),
            orderStatus: orderStatus as OrderStatus,
        };

        const result = await orderService.getMyOrders(req.member, inquiry);

        res.status(HttpCode.CREATED).json(result);
    } catch (error) {
        console.error("Error in getMyOrders:", error);
        if (error instanceof Errors) {
            res.status(error.code).json(error);
        } else {
            res.status(Errors.standard.code).json(Errors.standard);
        }
    }
};

orderController.updateOrder = async (req: ExtendedRequest, res: Response) => {
    try {
        const input: OrderUpdateInput = req.body;
        const result = await orderService.updateOrder(req.member, input);
        res.status(HttpCode.OK).json(result);
    } catch (error) {
        console.error("Error in updateOrder:", error);
        if (error instanceof Errors) {
            res.status(error.code).json(error);
        } else {
            res.status(Errors.standard.code).json(Errors.standard);
        }
    }
}

export default orderController;