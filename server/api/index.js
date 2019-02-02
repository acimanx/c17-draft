const router = require('express').Router();

let lastId = 0;

const newId = () => {
    lastId += 1;

    return lastId;
};

const fakeDb = [];

router.get('/houses', function(req, res) {
    res.json(fakeDb);
});

router.get('/house/:id', function(req, res) {
    const id = parseInt(req.params.id, 10);

    const houseObj = fakeDb.find(house => house.id === id);

    if (!houseObj) {
        return res.status(404).json({ error: `no house with id ${id}` });
    }

    return res.json(houseObj);
});

router.post('/contribute', function(req, res) {
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

router.use('*', function(req, res) {
    res.status(501).end();
});

module.exports = router;
