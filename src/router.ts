import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import petServiceController from "./controllers/petservice.controller";

/*** Member Routes ***/
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post("/member/logout", memberController.verifyAuth, memberController.logout);
router.get("/member/detail", memberController.verifyAuth, memberController.getMemberDetail);

/*** Product Routes ***/

/*** Order Routes ***/

/*** Pet Service Routes ***/
router.get("/pet-service/slots", petServiceController.getAvailableSlots);
router.post("/pet-service/create", petServiceController.createPetService);
router.get("/pet-service/my/:memberId", petServiceController.getMyPetServices);
router.post("/pet-service/cancel/:id", petServiceController.cancelPetService);

export default router;