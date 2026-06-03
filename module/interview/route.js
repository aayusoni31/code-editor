import { Router } from "express";
import {
  createRoom,
  getRoomList,
  getRoomById,
  saveRoomCode,
  deleteRoom,
  fixCodeWithAI,
  executeCode,
} from "./controller.js";

const router = Router();
router.route("/fix").post(fixCodeWithAI);
router.route("/execute").post(executeCode);
router.route("/").post(createRoom).get(getRoomList);

router.route("/:id").get(getRoomById).put(saveRoomCode).delete(deleteRoom);

export default router;
