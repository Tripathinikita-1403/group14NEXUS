import { GoogleGenAI } from "@google/genai";

async function generateMascot(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
            aspectRatio: "1:1",
        },
    },
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

export const generateAllMascots = async () => {
  const idle = await generateMascot("A cute 3D rendered baby penguin standing on snow, high quality, Pixar style, friendly expression, soft fur texture, large expressive eyes");
  const happy = await generateMascot("A cute 3D rendered baby penguin smiling and waving, high quality, Pixar style, joyful expression, soft lighting");
  const celebrate = await generateMascot("A cute 3D rendered white monster with small horns, big friendly smile, dancing happily, high quality, Pixar style, soft white fur");
  const sad = await generateMascot("A cute 3D rendered baby penguin looking slightly sad, high quality, Pixar style, soft blue lighting");
  
  return { idle, happy, celebrate, sad };
};
