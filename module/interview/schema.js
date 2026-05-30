import { Schema, model } from "mongoose";
const interviewSchema = new Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    roomName: {
      type: String,
    },
    code: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);
export default model("Interview", interviewSchema);
