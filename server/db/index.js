const util = require('util');
const mysql = require('mysql');

let db;

if (process.env.DATABASE_URL) {
    db = mysql.createPool(process.env.DATABASE_URL);
} else {
    db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
}

db.queryPromise = util.promisify(db.query);

module.exports = db;
