// import { Schema, model } from "mongoose";

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
    // NEW: Tell MongoDB to save the language!
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
