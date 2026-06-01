import * as crypto from "node:crypto";
import Interview from "./schema.js";

export const createRoom = async (req, res) => {
  try {
    const roomName = req.body.name;
    const length = 6;
    const roomId = crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .slice(0, length);

    const interview = new Interview({ roomName, roomId });
    const newInterview = await interview.save();
    return res.status(201).json(newInterview);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const getRoomList = async (req, res) => {
  try {
    const interviews = await Interview.find().lean().exec();
    // Use .json() here instead of .send()
    return res.status(200).json(interviews);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const getRoomById = async (req, res) => {
  try {
    const id = req.params.id;

    // FIX: We must search by our 6-character roomId, NOT MongoDB's internal ID!
    const interview = await Interview.findOne({ roomId: id }).lean().exec();

    if (!interview) {
      return res.status(404).send("Interview not found");
    }
    return res.status(200).json(interview);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const saveRoomCode = async (req, res) => {
  try {
    const id = req.params.id;
    // FIX: Grab both the code AND the language from the frontend!
    const { code, language } = req.body;

    // Save both to MongoDB
    await Interview.findOneAndUpdate({ roomId: id }, { code, language });

    return res.status(200).send("Code and Language saved successfully");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
