const router = require('express').Router();
const User = require('../model/User')

router.post('/register', async (req, res) => {
    console.log('req.body', req.body);
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;