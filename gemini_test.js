import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAaDreF8B6Kkz43fvFTtn-okqokqHw5Ddo");

async function testGemini() {
  try {
    // ✅ use the correct model path with the "models/" prefix
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const result = await model.generateContent("Say hello from Gemini!");
    const text = await result.response.text();

    console.log("✅ Gemini responded:", text);
  } catch (err) {
    console.error("❌ Gemini API Error:", err);
  }
}

testGemini();
