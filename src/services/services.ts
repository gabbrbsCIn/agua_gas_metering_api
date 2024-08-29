import { GoogleGenerativeAI } from "@google/generative-ai";
import { Base64Decoded } from "../types/types";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("A chave da API GEMINI não foi definida.");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateMeasureValue = async (base64Image: Base64Decoded) => {
  const prompt =
    "Diga o número que está presente no medidor do hidrômetro. SOMENTE o número";

  const result = await model.generateContent([prompt, base64Image]);

  return result;
};

export const generateTemporaryImageURL = async (
  base64Image: Base64Decoded
): Promise<string> => {
  const match = base64Image.inlineData.mimeType.match(/^image\/(.*)$/);
  let imageFormat = "jpeg";
  if (match && match[1]) {
    imageFormat = match[1];
  }
  const fileName = `${uuidv4()}.${imageFormat}`;

  const tempDir = path.join(__dirname, "temp_images");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const imageBuffer = Buffer.from(base64Image.inlineData.data, "base64");

  const filePath = path.join(tempDir, fileName);

  await fs.promises.writeFile(filePath, imageBuffer);

  const imageUrl = `${filePath}`;

  return imageUrl;
};
