import express from "express";
const routerAdmin = express.Router();
import marketController from "./controllers/market.controller";
import productController from "./controllers/product.controller";
import petServiceController from "./controllers/petservice.controller";
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

/*** Pet Service Routes ***/
routerAdmin.get(
    "/pet-service/all",
    marketController.verifyAdmin,
    petServiceController.getAllPetServices
);

routerAdmin.post(
    "/pet-service/create",
    marketController.verifyAdmin,
    petServiceController.createPetService
);

routerAdmin.post(
    "/pet-service/edit",
    marketController.verifyAdmin,
    petServiceController.updateChosenPetService
);

/*** User Routes ***/
routerAdmin.get(
    "/user/all",
    marketController.verifyAdmin,
    marketController.getUsers
);
routerAdmin.post(
    "/user/edit",
    marketController.verifyAdmin,
    marketController.updateChosenUser
);


export default routerAdmin;