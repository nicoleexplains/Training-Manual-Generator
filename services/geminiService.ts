
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a diagram or artwork based on a text prompt.
 * @param prompt The text description of the image to generate.
 * @returns A promise that resolves to the base64 encoded image string.
 */
export async function generateDiagram(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Generate a high-quality, clear, and professional diagram or piece of artwork suitable for a training manual or presentation. The style should be clean and easy to understand. Prompt: "${prompt}"`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        // 16:9 is a common aspect ratio for presentations (PPT files)
        aspectRatio: '16:9', 
      },
    });
    
    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("The API did not return any images.");
    }
    
    const image = response.generatedImages[0];
    if (!image.image.imageBytes) {
      throw new Error("The returned image data is empty.");
    }

    return image.image.imageBytes;

  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error("Invalid API Key. Please check your configuration.");
    }
    throw new Error("Failed to generate image. Please try again later.");
  }
}
