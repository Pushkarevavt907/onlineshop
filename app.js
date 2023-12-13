const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'prodd',
    password: '88888',
    port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    pool.end();
});
const db = require('./db.js');

db.getDataFromDatabase((err, data) => {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
        // Do something with the retrieved data
    }
});