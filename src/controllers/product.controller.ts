import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Error";
import { T } from "../libs/types/common";
import { AdminRequest } from "../libs/types/member";
import ProductService from "../models/Product.service";
import { ProductInput } from "../libs/types/product";

const productService = new ProductService();
const productController: T = {};
/*** SPA ***/

/*** SSR ***/
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

productController.createNewProduct = async (req: AdminRequest, res: Response) => {
    try {
        console.log("createNewProduct");
        if (!req.files?.length) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

        const data: ProductInput = req.body;
        data.productImages = req.files?.map((ele) => {
            return ele.path.replace(/\\/g, "/");
        });
        await productService.createNewProduct(data);

        res.send(`<script>alert("Product created successfully!"); window.location.replace("/admin/product/all");</script>`);
    } catch (error) {
        console.error("Error in createNewProduct:", error);
        const message =
            error instanceof Errors ? error.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}"); window.location.replace("/admin/product/all");</script>`);

    }
}

productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenProduct");
        const id = String(req.params.id);
        const result = await productService.updateChosenProduct(id, req.body);

        res.status(HttpCode.OK).json({ data: result });
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