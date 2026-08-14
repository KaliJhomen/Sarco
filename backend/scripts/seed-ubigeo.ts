import * as mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const CSV_PATH = path.join(__dirname, 'data', 'ubigeo_inei_2025.csv');

interface UbigeoRow {
  codigo: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

function parseCsv(content: string): UbigeoRow[] {
  const rows: UbigeoRow[] = [];
  const lines = content.split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const [departamento, provincia, distrito, ubigeo] = line.split(';').map((c) => c.trim());
    if (!/^\d{6}$/.test(ubigeo ?? '')) continue;
    rows.push({ codigo: ubigeo, departamento, provincia, distrito });
  }
  return rows;
}

async function seed() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`Falta el CSV en ${CSV_PATH}.`);
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'sarcos_db',
  });

  try {
    const rows = parseCsv(fs.readFileSync(CSV_PATH, 'utf-8'));
    console.log(`Insertando ${rows.length} distritos...`);

    const BATCH = 500;
    for (let i = 0; i < rows.length; i += BATCH) {
      await connection.query(
        'INSERT IGNORE INTO ubigeo (codigo, departamento, provincia, distrito) VALUES ?',
        [rows.slice(i, i + BATCH).map((r) => [r.codigo, r.departamento, r.provincia, r.distrito])],
      );
    }

    const [result] = await connection.query<mysql.RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM ubigeo',
    );
    console.log(`Ubigeo listo. Total en BD: ${result[0].total}`);
  } catch (error) {
    console.error('Seed ubigeo falló:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();