const { readFile } = require('fs').promises;
const path = require('path');
const db = require('./db');

async function initializeDatabase() {
    try {
        const schemaPath = path.resolve('./schema.sql');
        const schemaSQL = await readFile(schemaPath, 'utf8');
        await db.query(schemaSQL);
        console.log('Database schema created successfully');
    } catch (error) {
        console.error('Error creating database schema:', error);
    } finally {
        db.end();
    }
}

initializeDatabase();