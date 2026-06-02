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

// 1. The NEW getRoomList (with search and filters)
export const getRoomList = async (req, res) => {
  try {
    const { search, language } = req.query;

    let filter = {};

    if (search) {
      filter.roomName = { $regex: search, $options: "i" };
    }

    if (language) {
      filter.language = language;
    }

    const interviews = await Interview.find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return res.status(200).json(interviews);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// 2. getRoomById (so the Editor can load code)
export const getRoomById = async (req, res) => {
  try {
    const id = req.params.id;

    const interview = await Interview.findOne({ roomId: id }).lean().exec();

    if (!interview) {
      return res.status(404).send("Interview not found");
    }
    return res.status(200).json(interview);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// 3. saveRoomCode (with language saving)
export const saveRoomCode = async (req, res) => {
  try {
    const id = req.params.id;
    const { code, language } = req.body;

    await Interview.findOneAndUpdate({ roomId: id }, { code, language });

    return res.status(200).send("Code and Language saved successfully");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
export const deleteRoom = async (req, res) => {
  try {
    const id = req.params.id;
    // Find the room by its 6-character ID and delete it
    await Interview.findOneAndDelete({ roomId: id });
    return res.status(200).send("Room deleted successfully");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
