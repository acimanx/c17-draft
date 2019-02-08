const router = require('express').Router();
const validator = require('validator');

const db = require('../db');
const mailer = require('../cron/mailer')

let lastId = 0;

const newId = () => {
    lastId += 1;

    return lastId;
};

const fakeDb = [];

router.get('/houses', function (req, res) {
    res.json(fakeDb);
});

router.get('/house/:id', function (req, res) {
    const id = parseInt(req.params.id, 10);

    const houseObj = fakeDb.find(house => house.id === id);

    if (!houseObj) {
        return res.status(404).json({ error: `no house with id ${id}` });
    }

    return res.json(houseObj);
});

router.post('/contribute', function (req, res) {
    const { description } = req.body;
    const price = parseInt(req.body.price, 10);

    if (!typeof price === 'number' || Number.isNaN(price) || price <= 0) {
        return res
            .status(400)
            .json({ error: `'price' should be a positive number` });
    }

    if (!typeof description === 'string' || !description.trim()) {
        return res
            .status(400)
            .json({ error: `'description' should be not empty string` });
    }

    const item = {
        id: newId(),
        price,
        description,
    };

    fakeDb.push(item);

    return res.json(item);
});

router.use('/contribute_url', async (req, res) => {
    const { url, email, frequency } = req.body;

    if (typeof url !== 'string' || !validator.isURL(url)) {
        return res.json({ error: 'url should be a valid url value' });
    }

    if (typeof email !== 'string') {
        return res.json({ error: 'email should be a valid email value' });
    }

    if (
        typeof frequency !== 'number' ||
        Number.isNaN(frequency) ||
        frequency <= 0
    ) {
        return res.json({ error: 'frequency should be a positive number' });
    }

    const sql = `
        insert into contribute_url (
            url,
            email,
            frequency,
            created_at    
        ) values (?);
    `;
    const data = [url, email, frequency, new Date()];

    try {
        await db.queryPromise(sql, [data]);
        await mailer(email).catch(console.error);
        return res.end();
    } catch (e) {
        console.log(e);
        return res.status(500).end();
    }
});

router.use('*', function (req, res) {
    res.status(501).end();
});

module.exports = router;
