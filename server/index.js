require('dotenv').load();

const app = require('./app');
const db = require('./db');

const reset = '\x1b[0m';
const сyan = '\x1b[36m';
const yellow = '\x1b[33m';

const testSql = 'select 1+2 as result';

db.query(testSql)
    .then(rows => {
        console.log(`\n${yellow}db is ok (1 + 2 == ${rows[0].result})${reset}`);
        app.start(() => {
            console.log(
                `${yellow}app is running at ${сyan}${app.get(
                    'baseUrl'
                )}${reset}\n`
            );
        });
    })
    .catch(err => {
        console.log(err);
    });
