import express from 'express';
import jwt from 'jsonwebtoken';
import { users } from '../data/mockData.js';
import { query, useDatabase } from '../config/db.js';

const router = express.Router();

async function findUserByEmail(email) {
  if (useDatabase) {
    const result = await query('SELECT * FROM app_users WHERE email = $1 LIMIT 1', [email]);
    return result.rows[0];
  }
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Informe e-mail e senha.' });
  const user = await findUserByEmail(email);
  if (!user || user.password !== password) return res.status(401).json({ error: 'Credenciais inválidas.' });
  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    area: user.area,
    avatar: user.avatar
  };
  const token = jwt.sign(publicUser, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });
  res.json({ token, user: publicUser });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token ausente.' });
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    res.json({ user });
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
});

export default router;
