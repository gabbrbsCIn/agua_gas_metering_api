import express, { Application, Request, Response } from "express";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app: Application = express();
const port = process.env.PORT || 8000;

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("A chave da API GEMINI não foi definida.");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json({ limit: "50mb" }));


app.post("/upload", async (req: Request, res: Response) => {
  try {
    const { base64Image } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: "Campo base64Image não foi preenchido" });
    }
    const prompt =
      "Diga o número que está presente no medidor do hidrômetro. SOMENTE o número";

    const result = await model.generateContent([prompt, {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    }]);
    res.send(result).status(200);
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar a imagem:" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
