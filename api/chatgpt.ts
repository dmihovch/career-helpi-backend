import { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (request: VercelRequest, response: VercelResponse) => {
  console.log("Incoming message:", JSON.stringify(request.body));

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  try {
    const { message } =
      typeof request.body === "string"
        ? JSON.parse(request.body)
        : request.body;

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    response
      .status(200)
      .json({ response: completion.choices[0].message.content });
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
};
