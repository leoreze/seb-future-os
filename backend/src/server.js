import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import apiRoutes from './routes/api.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const frontendDir = path.join(rootDir, 'frontend');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(frontendDir));
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`SEB Future OS v1 rodando em http://localhost:${port}`);
});
