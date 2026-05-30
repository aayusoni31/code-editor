import { Router } from "express";
import { createRoom, getRoomList, getRoomById } from "./controller.js";
const router = Router();
router.route("/").post(createRoom).get(getRoomList);
router.route("/:id").get(getRoomById);
export default router;
