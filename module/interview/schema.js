import { Schema, model } from "mongoose"; // <-- This is the magic line that was missing!

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
    language: {
      type: String,
      default: "javascript",
    },
  },
  {
    timestamps: true,
  },
);

export default model("Interview", interviewSchema);
