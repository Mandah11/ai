// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.NEW_PUBLIC_API_URL,
// });
// async function main() {
//   console.log("mndh1");
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }
// main();
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEW_PUBLIC_API_URL, // must NOT be public
});

export const POST = async (request: NextRequest) => {
  try {
    const { textarea } = await request.json();
    const prompt = `give me this food ingredients only ${textarea}`;
    if (!textarea) {
      return NextResponse.json(
        { error: "No prompt provided" },
        { status: 400 }
      );
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return NextResponse.json({ result: response.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
