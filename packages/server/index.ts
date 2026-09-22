import express, { type Request , type    Response} from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send(process.env.groq_API_KEY );
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});