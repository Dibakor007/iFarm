import { getGeminiResponse } from "../services/gemini.service.js";

export const askGemini = async (req, res) => {
  try {
    const { prompt } = req.body;
    const reply = await getGeminiResponse(prompt);

    res.status(200).json({ response: reply });
  } catch (error) {
    res.status(500).json({ error: "Gemini API failed" });
  }
};
