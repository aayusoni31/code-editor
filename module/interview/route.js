import { Router } from "express";
import {
  createRoom,
  getRoomList,
  getRoomById,
  saveRoomCode,
  deleteRoom,
} from "./controller.js";

const router = Router();

router.route("/").post(createRoom).get(getRoomList);

router.route("/:id").get(getRoomById).put(saveRoomCode).delete(deleteRoom);

export default router;
