'use strict';

require('dotenv').config();

require('babel-register');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

require('./src/app.js').start(process.env.PORT);