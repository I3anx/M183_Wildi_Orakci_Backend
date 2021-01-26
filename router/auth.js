const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fs = require('fs');

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
        res.send(`Registration of ${savedUser.username} was successful.`);
    } catch (err) {
        return res.status(400).send(err);
    }

    fs.appendFile('registrationLogs.txt', `User ${user.username} has registered\n`, function (err) {
        if (err) throw err;
    });
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Username not found');

    const validatedPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validatedPassword) return res.status(400).send('Invalid Password');

    fs.appendFile('loginLogs.txt', `User ${user.username} logged in\n`, function (err) {
        if (err) throw err;
    });

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET);
    res.send(token);
});

module.exports = router;