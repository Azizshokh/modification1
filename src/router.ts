import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import petServiceController from "./controllers/petservice.controller";

router.post("/login", memberController.login);
router.post("/signup", memberController.signup);

/*** Pet Service Routes ***/
router.get("/pet-service/slots", petServiceController.getAvailableSlots);
router.post("/pet-service/create", petServiceController.createPetService);
router.get("/pet-service/my/:memberId", petServiceController.getMyPetServices);
router.post("/pet-service/cancel/:id", petServiceController.cancelPetService);

export default router;