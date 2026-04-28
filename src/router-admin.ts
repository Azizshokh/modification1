import express from "express";
const routerAdmin = express.Router();
import marketController from "./controllers/market.controller";

/*** Admin Routes ***/
routerAdmin.get("/", marketController.goHome);
routerAdmin
    .get("/login", marketController.getLogin)
    .post("/login", marketController.proccesLogin);
routerAdmin
    .get("/signup", marketController.getSignup)
    .post("/signup", marketController.proccesSignup);

routerAdmin.get("/check-me", marketController.checkAuthSession);

/*** Product Routes ***/
/*** User Routes ***/

export default routerAdmin;