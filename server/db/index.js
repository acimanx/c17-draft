const util = require('util');
const mysql = require('mysql');

let db;

(checking => {
    const params = {
        DATABASE_URL: process.env.DATABASE_URL,
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME
    };
    Object.entries(params).forEach(x => {
        if (typeof x[1] !== 'string') {
            console.log(
                `${x[0]} is empty, please check documentation and create .env file`
            );
        } else {
            proceeding();
        }
    });
})();

function proceeding() {
    if (process.env.DATABASE_URL) {
        db = mysql.createPool(process.env.DATABASE_URL);
    } else {
        db = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    }
    db.queryPromise = util.promisify(db.query);
}

module.exports = db;
