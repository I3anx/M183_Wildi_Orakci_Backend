const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./router/auth');
const postRoute = require('./router/posts');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to db');
});

const app = express();
app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

const server = app.listen(3030, () => console.log(`The server is running on port ${server.address().port}`));
