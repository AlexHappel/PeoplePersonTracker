const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'your-username',
    password: 'your-password',
    database: 'company_db'
});

client.connect();

module.exports = client;