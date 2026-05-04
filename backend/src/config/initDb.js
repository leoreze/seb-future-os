import dotenv from 'dotenv';
import { query } from './db.js';
dotenv.config();

async function main() {
  await query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      area TEXT,
      avatar TEXT
    );
  `);
  await query(`
    INSERT INTO app_users (id, name, email, password, role, area, avatar) VALUES
    ('u-rede','Diretoria SEB Future','rede@sebfuture.local','123456','rede','Gestão Central','RF'),
    ('u-escola','Direção Escola Jardins','escola@sebfuture.local','123456','escola','Unidade Escolar','EJ'),
    ('u-coord','Coordenação Pedagógica','coordenacao@sebfuture.local','123456','coordenacao','Coordenação','CP'),
    ('u-prof','Professor Rafael Lima','professor@sebfuture.local','123456','professor','Professor','RL'),
    ('u-familia','Família Oliveira','familia@sebfuture.local','123456','familia','Família','FO'),
    ('u-estudante','Lia Oliveira','estudante@sebfuture.local','123456','estudante','Estudante','LO')
    ON CONFLICT (email) DO NOTHING;
  `);
  console.log('Banco inicializado com usuários de demonstração.');
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
