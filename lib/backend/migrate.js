import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    // Ваш SQL из предыдущих миграций
    await pool.query(`
      CREATE TYPE user_role AS ENUM ('admin', 'manager', 'viewer');
      CREATE TYPE car_status AS ENUM ('available', 'sold', 'reserved');
      CREATE TYPE deal_type AS ENUM ('sale', 'reservation');
      CREATE TYPE deal_status AS ENUM ('new', 'in_process', 'completed', 'canceled');

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role user_role NOT NULL DEFAULT 'viewer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        brand VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        year INTEGER NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        mileage INTEGER NOT NULL,
        body_type VARCHAR(50) NOT NULL,
        description TEXT,
        status car_status DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- ... остальные таблицы
    `);
    console.log('✅ Database migrated successfully');
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
}

migrate();