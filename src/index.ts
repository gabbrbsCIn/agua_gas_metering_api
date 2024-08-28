
import express, { Express, Request, Response , Application } from 'express';


const app: Application = express();
const port = 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World').status(200);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});