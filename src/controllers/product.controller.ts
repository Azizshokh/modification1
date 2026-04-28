import { Request, Response } from "express";
import Errors, { Message } from "../libs/Error";
import { T } from "../libs/types/common";
import { AdminRequest } from "../libs/types/member";
import ProductService from "../models/Product.service";

const productService = new ProductService();
const productController: T = {};

productController.getAllProducts = async (req: AdminRequest, res: Response) => {
    try {
        console.log("getAllProducts");
        res.render("products");
    } catch (error) {
        console.error("Error in getAllProducts:", error);
        if (error instanceof Errors) {
            res.status(error.code).json(error);
        } else {
            res.status(500).json(error);
        }
    }
}

productController.createNewProduct = async (req: Request, res: Response) => {
    try {
        console.log("createNewProduct");
        res.send("createNewProduct");
    } catch (error) {
        console.error("Error in createNewProduct:", error);
        if (error instanceof Errors) {
            res.status(error.code).json(error);
        } else {
            res.status(500).json(error);
        }
    }
}

productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenProduct");
    } catch (error) {
        console.error("Error in updateChosenProduct:", error);
        if (error instanceof Errors) {
            res.status(error.code).json(error);
        } else {
            res.status(500).json(error);
        }
    }
}

export default productController;