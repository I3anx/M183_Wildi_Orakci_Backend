const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



router.post('/register', async (req, res) => {
    // validate user data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if username already exists
    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) return res.status(400).send('Username already exists');

    // hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create and save new user
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
    })
    try {
        const savedUser = await user.save();
        res.send(savedUser._id);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Username not found');

    const validatedPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validatedPassword) return res.status(400).send('Invalid Password');

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    res.send('Logged in');
});

module.exports = router;