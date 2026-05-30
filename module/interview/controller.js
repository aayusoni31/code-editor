import * as crypto from "node:crypto";
// crypto is a tool built directly into Node.js used for generating highly secure, random data (way better than Math.random()).
import Interview from "./schema.js";
// export const createRoom = async (req, res) => {
//   try {
//     const roomName = req.body.name;
//     const length = 6;
//     const roomId = crypto
//       .randomBytes(Math.ceil(length / 2))
//       .toString("hex")
//       .slice(0, length);

//     const interview = new Interview({ roomName, roomId });
//     const newInterview = await interview.save();
//     return res.status(201).send("Room Created");
//   } catch (err) {
//     return res.status(500).send(err.message);
//   }
// };
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

    //  We are sending the actual database object back as JSON!
    return res.status(201).json(newInterview);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
export const getRoomList = async (req, res) => {
  try {
    const interviews = await Interview.find().lean().exec();
    return res.status(200).send(interviews);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
export const getRoomById = async (req, res) => {
  try {
    const id = req.params.id;
    const interview = await Interview.findById(id).lean().exec();

    if (!interview) {
      return res.status(404).send("Interview not found");
    }
    return res.status(200).send(interview);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
