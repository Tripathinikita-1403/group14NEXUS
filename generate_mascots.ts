import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function generateAndLog(prompt: string, name: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        console.log(`MASCOT_${name}_START`);
        console.log(part.inlineData.data);
        console.log(`MASCOT_${name}_END`);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await generateAndLog("A cute 3D rendered baby penguin standing on ice, Pixar style, friendly expression, high quality", "IDLE");
  await generateAndLog("A cute 3D rendered baby penguin jumping with joy, Pixar style, big smile, high quality", "HAPPY");
  await generateAndLog("A cute 3D rendered white monster with small horns, dancing happily, Pixar style, high quality", "CELEBRATE");
  await generateAndLog("A cute 3D rendered baby penguin looking sad, Pixar style, high quality", "SAD");
}

run();
