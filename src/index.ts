import express, { Application, Request, Response } from "express";
import "dotenv/config";
import { router } from "./routes/routes";

const app: Application = express();
const port = process.env.PORT || 8000;


app.use(express.json({ limit: "50mb" }));

app.use("/", router);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
