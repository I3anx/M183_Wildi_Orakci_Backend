const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.json({ identity: { title: 'postTitle', description: 'issa post description' } });
}); 

module.exports = router;