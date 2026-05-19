import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import petServiceController from "./controllers/petservice.controller";
import productController from "./controllers/product.controller";
import uploader from "./libs/utils/uploader";
import orderController from "./controllers/order.controller";

/*** Member Routes ***/
router.get("/member/getAdmin", memberController.getAdmin);
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post("/member/logout", memberController.verifyAuth, memberController.logout);
router.get("/member/detail", memberController.verifyAuth, memberController.getMemberDetail);
router.post(
    "/member/update",
    memberController.verifyAuth,
    uploader("members").single("memberImage"),
    memberController.updateMemberDetail
);
router.get("/member/top-users", memberController.getTopUsers);

/*** Product Routes ***/
router.get("/product/all", productController.getProducts);
router.get("/product/:id", memberController.retrieveAuth, productController.getProductDetail);

/*** Order Routes ***/
router.post("/order/create", memberController.verifyAuth, orderController.createOrder);
router.get("/order/all", memberController.verifyAuth, orderController.getMyOrders);
router.post("/order/update", memberController.verifyAuth, orderController.updateOrder);

/*** Pet Service Routes ***/
router.get("/pet-service/slots", petServiceController.getAvailableSlots);
router.post("/pet-service/create", petServiceController.createPetService);
router.get("/pet-service/my", memberController.verifyAuth, petServiceController.getMyAuthenticatedPetServices);
router.get("/pet-service/my/:memberId", petServiceController.getMyPetServices);
router.post("/pet-service/cancel/:id", petServiceController.cancelPetService);

/*** Aliases (generic API naming) ***/
router.post("/api/pet-service", petServiceController.createPetService);

export default router;
