import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  try {
    // Тестовые пользователи
    await pool.query(`
      INSERT INTO users (name, email, password_hash, role) VALUES
      ('Администратор', 'admin@autosalon.ru', '123456', 'admin'),
      ('Менеджер Иван', 'manager@autosalon.ru', '123456', 'manager'),
      ('Наблюдатель', 'viewer@autosalon.ru', '123456', 'viewer')
      ON CONFLICT (email) DO NOTHING;
    `);

    // Тестовые автомобили
    await pool.query(`
      INSERT INTO cars (brand, model, year, price, mileage, body_type, description, status) VALUES
      ('Toyota', 'Camry', 2022, 2500000.00, 15000, 'Седан', 'Комфортный седан бизнес-класса', 'available'),
      ('BMW', 'X5', 2023, 5500000.00, 5000, 'Внедорожник', 'Премиальный внедорожник', 'available')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Test data seeded successfully');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
}

seed();