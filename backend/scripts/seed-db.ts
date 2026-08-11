import * as mysql from 'mysql2/promise';
import * as bcryptjs from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'sarcos_db',
  });

  try {
    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT id_usuario FROM usuario WHERE email = ?',
      ['admin@sarcos.com']
    );

    if (Array.isArray(existing) && existing.length > 0) {
      console.log('Admin user already exists. Skipping.');
      return;
    }

    // Hash password
    const hashedClave = await bcryptjs.hash('Admin123!', 10);

    // Insert admin user
    const [result] = await connection.execute(
      `INSERT INTO usuario (login, email, clave, nombre)
       VALUES (?, ?, ?, ?)`,
      ['admin@sarcos.com', 'admin@sarcos.com', hashedClave, 'Administrador']
    );

    const insertId = (result as any).insertId;
    console.log(`Admin user created successfully. ID: ${insertId}`);
    console.log('Login: admin@sarcos.com');
    console.log('Password: Admin123!');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();