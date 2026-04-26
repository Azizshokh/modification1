import express from "express";
const routerAdmin = express.Router();
import marketController from "./controllers/market.controller";

routerAdmin.get("/", marketController.goHome);

routerAdmin.get("/login", marketController.getLogin);

routerAdmin.get("/signup", marketController.getSignup);


export default routerAdmin;