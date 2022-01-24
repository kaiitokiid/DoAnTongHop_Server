const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/tome_ecommer', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect success!');
    } catch (error) {
        console.log('Connect failure!');
        console.log(error);
    }
}

module.exports = { connect };