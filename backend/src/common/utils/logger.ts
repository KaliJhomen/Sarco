import * as fs from 'fs';
import * as path from 'path';

export function writeLog(message: string) {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'errors.log');

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(logFile, logMessage, 'utf8');
  } catch (error) {
    process.stderr.write(`Error al escribir log: ${error}\n`);
  }
}
