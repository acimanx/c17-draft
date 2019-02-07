const axios = require('axios');

const db = require('../db');

const FREQUENCY_VALUE_SECONDS = 60;

const urlsToProcessSQL = `
    select *
    from 
        contribute_url
    where 
        last_process is null or 
        unix_timestamp() - unix_timestamp(last_process) >= frequency * ${FREQUENCY_VALUE_SECONDS}
`;

const updateSQL = `
    update
        contribute_url
    set
        last_process = ?
    where
        id in (?)
`;

const fetchData = async () => {
    console.log('checking contributions...');
    const contributions = await db.queryPromise(urlsToProcessSQL);

    console.log(
        'found',
        contributions.length,
        contributions.map(({ url, frequency }) => ({
            url,
            frequency,
        }))
    );

    await Promise.all(
        contributions.map(c =>
            axios.get(c.url).then(res => {
                console.log(res.data);
            })
        )
    );

    if (contributions.length) {
        const params = [new Date(), contributions.map(c => c.id)];

        await db.queryPromise(updateSQL, params);
    }
};

module.exports = fetchData;
