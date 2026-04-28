import express from "express";
const routerAdmin = express.Router();
import marketController from "./controllers/market.controller";
import productController from "./controllers/product.controller";

/*** Admin Routes ***/
routerAdmin.get("/", marketController.goHome);
routerAdmin
    .get("/login", marketController.getLogin)
    .post("/login", marketController.proccesLogin);
routerAdmin
    .get("/signup", marketController.getSignup)
    .post("/signup", marketController.proccesSignup);
routerAdmin.get("/logout", marketController.logout);
routerAdmin.get("/check-me", marketController.checkAuthSession);

/*** Product Routes ***/
routerAdmin.get("/product/all", productController.getAllProducts);
routerAdmin.post("/product/create", productController.createNewProduct);
routerAdmin.post("/product/:id", productController.updateChosenProduct);

/*** User Routes ***/

export default routerAdmin;