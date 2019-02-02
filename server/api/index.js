const router = require('express').Router();

const fakeDb = [
    {
        id: 1,
        data: 'house 1 data',
    },
];

router.get('/houses', function(req, res) {
    res.json(fakeDb);
});

router.get('/house/:id', function(req, res) {
    res.json(fakeDb.find(house => house.id === req.params.id));
});

router.post('/contribute', function(req, res) {
    res.send('ok');
});

router.use('*', function(req, res) {
    res.status(404).end();
});

module.exports = router;
