import { GoogleGenerativeAI } from "@google/generative-ai";
import { Base64Decoded, MeasureDataBaseInsert } from "../types/types";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Customer, PrismaClient } from "@prisma/client";
import { ConflictError } from "../errors/errors";


const prisma = new PrismaClient();

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

  return parseInt(result.response.text());
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
  const tempDir = path.join(__dirname);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const imageBuffer = Buffer.from(base64Image.inlineData.data, "base64");
  const filePath = path.join(tempDir, fileName);

  await fs.promises.writeFile(filePath, imageBuffer);

  const response = await axios.post(
    "https://www.imghippo.com/v1/upload",
    {
      api_key: "BSesh7v0uExvYl24aGkFKsGm3bdsRbNV",
      file: fs.createReadStream(filePath),
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.data.success) {
    fs.unlinkSync(filePath);
    return response.data.data.url;
  } else {
    throw new Error("Upload falhou, verifique a resposta da API.");
  }
};

export const findCustomerCode = async (customer_code: string) => {
  const getCustomer = await prisma.customer.findUnique({
    where: {
      customer_code: customer_code,
    },
  });
  return getCustomer;
};

export const createCustomer = async (customer_code: string) => {
  const isCustomerCodeExists = await findCustomerCode(customer_code);
  if (!isCustomerCodeExists) {
    const customer = await prisma.customer.create({
      data: {
        customer_code: customer_code,
      },
      
    });
    return customer;
  }
  return customer_code;
};

export const createMeasure = async (measureData: MeasureDataBaseInsert) => {
  console.log(measureData);
  const measure = await prisma.measure.create({
    data: measureData,
    select: {
      image_url: true,
      measure_value: true,
      measure_uuid: true,
    },
  });
  return measure;
};



