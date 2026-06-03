import axios from "axios";
import * as crypto from "node:crypto";
import Interview from "./schema.js";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const JDOODLE_LANGUAGES = {
  javascript: { lang: "nodejs", version: "4" },
  python: { lang: "python3", version: "4" },
  java: { lang: "java", version: "4" },
  cpp: { lang: "cpp17", version: "1" },
};
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
export const fixCodeWithAI = async (req, res) => {
  try {
    const { code, language } = req.body;

    const prompt = `
      You are an expert software engineer. Look at the following ${language} code.
      Find any bugs, syntax errors, or improvements and fix them.
      CRITICAL RULE: Return ONLY the raw fixed code. Do not include markdown like \`\`\`javascript.
      
      Here is the code:
      ${code}
    `;

    // 4. This is the exact "Generate text" method from the documentation!
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const fixedCode = response.text;

    return res.status(200).json({ fixedCode });
  } catch (err) {
    console.error("AI Error:", err);
    return res.status(500).send(err.message);
  }
};
export const executeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    const jConfig = JDOODLE_LANGUAGES[language];
    if (!jConfig) {
      return res.status(400).send("Language not supported for execution");
    }

    // Call the completely free JDoodle API
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: code,
      language: jConfig.lang,
      versionIndex: jConfig.version,
    });

    // JDoodle returns the result in 'response.data.output'
    return res.status(200).json({
      stdout: response.data.output,
      stderr: response.data.error || null,
    });
  } catch (error) {
    console.error("Execution Error:", error.response?.data || error.message);
    return res.status(500).send("Failed to execute code");
  }
};
