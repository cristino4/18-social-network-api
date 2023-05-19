const userData = require('./data');
// const {Users,Thoughts} = require('../models');
const Users = require('../models/users')
const connection = require('../config/connection');

connection.on('error', (err) => err);

connection.once('open', async () => {
    await Users.deleteMany();
    await Users.insertMany(userData);
    console.log('data seeded');
    process.exit(0);
})