import express from 'express';
import dotenv from 'dotenv';
import { createApiRouter, createRootRouter } from './routes.ts';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(createRootRouter());
app.use('/api', createApiRouter());

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
