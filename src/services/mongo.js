const mongoose = require('mongoose');
require('dotenv').config();




const mongo_url = process.env.mongo_url;


mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready');
});

mongoose.connection.on('error', (err)=>{
    console.log(`Mongo Error: ${err}`);
});


async function mongoConnect(){
    mongoose.connect(mongo_url);
}




module.exports = {
    mongoConnect,
}