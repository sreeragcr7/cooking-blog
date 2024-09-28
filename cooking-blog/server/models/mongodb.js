const mongoose = require('mongoose');

const connect = mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'))
db.once('open', () => {
    console.log('Database Connected.')
})

// models
require('./Category');
require('./Recipe');