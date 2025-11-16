import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema.js'

// Crear el pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecosystem_automation',
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
  acquireTimeout: 60000,
  timeout: 60000,
})

// Crear la instancia de Drizzle
export const db = drizzle(pool, { schema })

// Helper para cerrar las conexiones
export async function closeDbConnection() {
  await pool.end()
}

// Exportar el pool para uso directo si es necesario
export { pool }

// Helper para ejecutar queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [rows] = await pool.execute(query, params)
    return rows
  } catch (error) {
    console.error('Error executing query:', error)
    throw error
  }
}