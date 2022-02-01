const express = require('express');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const { loadFilesSync } = require('@graphql-tools/load-files');
const  PORT  = process.env.PORT || 4000;
const { userRouter } = require('./routes/user.router')
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
const app = express();


app.use(morgan('combined'));
app.use(cors());
app.use(passport.initialize());



const typesGraphqlArray = loadFilesSync('**/*.graphql')

app.use('/graphql',
        graphqlHTTP(
        {   
            schema: typesGraphqlArray ,
            graphiql:true
        })
        )

app.use(express.json());
app.use('/api', userRouter);


app.get('/',(req,res)=>{
    res.json({
        'Message': 'Server is running',
        'graphql-endpoint':`http://localhost:${PORT}/graphql`,
        'user-auth':`/auth`
    })
})


module.exports ={
    app,
}


