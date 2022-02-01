const {users, validateUser, loginValidateUser } = require('../models/users.mongo');
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { jwtPassport }= require('../utils/passport');
const Token = require('../models/user.token.mongo');
const { sendEmail } = require('../services/mailer');
const crypto = require("crypto");


jwtPassport(passport);











const userRouter = express.Router();


userRouter.post('/signup', async (req, res)=>{

    const { error } = validateUser(req.body);
    console.log(req.body)
    if (error){
        console.log('switch: Error')
        return res.status(400).json({
            success: false,
            status: res.statusCode,
            method: req.method,
            'Error': error.details[0].message
        })
    }

    const _user = await users.findOne({
        email: req.body.email
    });
//    console.log('Error one failed')
    if (_user){
        console.log('User exists')
        return res.status(400).json({
            error:`user with ${req.body.email} exists`})
    }else{
        // console.log('Saving User')
        let user = new users({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
        // console.log(user)

        await user.save();

        const userToken = crypto.randomBytes(8).toString('hex');


        let token = await new Token({
            userId: user._id,
            token: userToken
        })
        console.log(token);
         token.save();
         const verficationLink_ = `${process.env.BASE_URL}/user/verify/${user._id}/${userToken}/`;
         
         await sendEmail(user.email, "Buycoins Backend Project: Verify Email",user.firstName,verficationLink_)


        return res.status(201).json({
            status: res.statusCode,
            method: req.method,
            message: 'New User Created Successfully',
            verification_message:'Users account is unverfied. Email for verfication has been sent.',
            success: true,
            data: user

        })
        
    }
})


userRouter.post('/login', function(req,res){
    const { error } = loginValidateUser(req.body);
    if (error){
        console.log('Error found ')
        return res.status(400).json({
            success: false,
            status: res.statusCode,
            method: req.method,
            Error: error.details[0].message
        });
    }
    // console.log(1)
    users.findOne({
        email: req.body.email
    },{"__v":0}, function(err, user){
        if (err) throw err;
  
        if(!user){
            res.status(401).json({
                success: false, 
                message: 'Authentication failed. User not found'
            });
        } else{
            // check of password matches
            user.comparePassword(req.body.password, function(err, isMatch){
                console.log(isMatch)
                if (isMatch && !err){
                    // if user is found and password is right create a token
                    
                    
                    
                    const token = jwt.sign({user}, process.env.secret );
                    // retrun the information including the token
                    return res.status(200).json({
                        success:true, 
                        'token': 'JWT' + token,
                        status: res.statusCode,
                        method: req.method,
                        data: user

                    });
                } else{
                    return res.status(401).send({
                        success: false,
                        status: res.status,
                        method: req.method,
                        message: "Authentication failed. Wrong password."
                    });
                }
            });
        }
    });
});






userRouter.get('/profile', async(req,res)=>{
    const profiles = await users.find({},{'_id':0, '__v':0,'password':0})
    res.status(200).json({
        data: profiles
    })
})



userRouter.post('/user/verify/:id/:userToken/', async (req,res)=>{

   const user_id= req.params.id;
    const _token = req.params.userToken;
   console.log(user_id, _token)
   console.log(req.params)
   try{
       console.log(0)
       const user = await users.findById({_id: user_id});
       
       if(!user){
           return res.status(400).json({
               method: req.method,
               status: res.statusCode,
               message: 'Invalid Link'
           });
           
       }
       const token_ = await Token.findOne({userID:user._id,token:_token});
       if(!token_){
           return res.status(400).json({
               method: req.method,
               status: res.statusCode,
               message: 'Token verification link invalid'
           })
       }
       let x = await users.findOneAndUpdate({_id: user._id}, {verified:true}, {upsert:true})
       console.log(x);
       await Token.findByIdAndRemove(token_._id);

       return res.status(200).json({
           method: req.method,
           status: res.statusCode,
           message: "User is now verified"
       })
   }catch(error){
       console.log(error)
       return res.status(400).json({
           status:res.statusCode,
           message:"An Error occured"
       })
   }



})










module.exports = {
    userRouter
}