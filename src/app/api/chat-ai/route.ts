import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
const ai = new GoogleGenAI({ apiKey: process.env.NEW_PUBLIC_API_URL });
export const POST = async (request: NextRequest) => {
  try {
    const { chat } = await request.json();
    if (!chat) {
      return NextResponse.json(
        { error: "No prompt provided" },
        { status: 400 }
      );
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: chat }],
        },
      ],
    });
    return NextResponse.json({ result: response.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
