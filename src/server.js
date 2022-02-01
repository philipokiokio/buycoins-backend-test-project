const express = require('express');
const { mongoConnect } = require('./services/mongo');
require('dotenv').config();
const{ app }  = require('./app');
const PORT = process.env.PORT || 4000;


async function startServer(){
    await mongoConnect();
    
    app.listen(PORT,()=>{
        console.log(`${PORT}`)
        console.log(`Server is running on ${PORT}`);

    })


}

startServer();




