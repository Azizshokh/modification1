import express from "express";
const routerAdmin = express.Router();
import marketController from "./controllers/market.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";

/*** Admin Routes ***/
routerAdmin.get("/", marketController.goHome);
routerAdmin
    .get("/login", marketController.getLogin)
    .post("/login", marketController.proccesLogin);
routerAdmin
    .get("/signup", marketController.getSignup)
    .post(
        "/signup",
        makeUploader("members").single("memberImage"),
        marketController.proccesSignup
    );
routerAdmin.get("/logout", marketController.logout);
routerAdmin.get("/check-me", marketController.checkAuthSession);

/*** Product Routes ***/
routerAdmin.get(
    "/product/all",
    marketController.verifyAdmin,
    productController.getAllProducts
);
routerAdmin.post(
    "/product/create",
    marketController.verifyAdmin,
    makeUploader("products").array("productImages", 5),
    productController.createNewProduct
);
routerAdmin.post(
    "/product/:id",
    marketController.verifyAdmin,
    productController.updateChosenProduct
);

/*** User Routes ***/
routerAdmin.get(
    "/user/all",
    marketController.verifyAdmin,
    marketController.getUsers
);


export default routerAdmin;