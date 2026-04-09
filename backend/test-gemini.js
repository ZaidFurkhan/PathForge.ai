const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function run() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    console.log("Sending request to Gemini...");
    const result = await model.generateContent("Create a simple valid JSON object with key 'test' and value 'hello'");
    console.log("Valid response:", result.response.text());
  } catch (err) {
    console.error("ERROR CAUGHT:", err);
  }
}

run();
