import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// This POST function handles the API request and returns a response
export const POST = async (request: Request) => {
  const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

  try {
    const {prompt } = await request.json();

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });

    const result = await model.generateContent(prompt);

    const reply = await result.response.text();

    return NextResponse.json({ reply });

  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};