const mongoose = require('mongoose');
const databaseURL = process.env.DATABASE_URL; //babasahin enviroment variable na gagamitin para kuunnect sa database
const connectDb = async () => {
    try {
        await mongoose.connect(databaseURL);
        console.log('Connection of Database: Success');
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDb;