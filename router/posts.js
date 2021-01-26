const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    if (req.user.role !== 'admin') return res.status(400).send('You are not allowed to view this content!');
    res.json({ identity: { title: 'postTitle', description: 'issa post description' } });
});

module.exports = router;