const { readFile } = require('fs').promises;
const path = require('path');
const db = require('./db')

async function seedDatabase() {
    try {
        const seedPath = path.resolve('./seeds.sql');
        const seedSQL = await readFile(seedPath, 'utf8');
        await db.query(seedSQL);
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        db.end();
    }
}

seedDatabase();