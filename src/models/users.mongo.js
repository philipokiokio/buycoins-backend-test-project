const mongoose = require('mongoose')
const joi = require('joi');
const { validate } = require('graphql');
const { boolean, required } = require('joi');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');



const userSchema = new Schema({
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    email: {type:String, unique:true ,required:true},
    password: {type: String, required:true, minlength:6},
    verified: {type: Boolean, required: true, default: false},
    date: {type:Date, default: Date.now}

});

userSchema.pre('save', function (next){
    let user = this;
    // console.log('Entering this pre save ')
    // console.log(this.isModified('password'), this.isNew)
    if (this.isModified('password') || this.isNew){
        // console.log('Entered the maze')
        bcrypt.genSalt(10, function(err, salt){
            // console.log(1)
            if(err){
                // console.log(22)
                return next(err);
            }
            console.log(`hashing`)

            bcrypt.hash(user.password, salt, function(err, hash){
                console.log(2)
                if (err){
                    console.log('Pre save error')
                    return next(err);


                }
                console.log("presave one")
                user.password= hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function(passw, cb){
    console.log(this.password)
    bcrypt.compare(passw, this.password, function(err, isMatch){
        if (err){
            return cb(err);

        }
        console.log(isMatch)
        cb(null,isMatch);
    });
};



function validateUser(user){
    const schema = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().required().email(),
        password: joi.string().min(6).required(),
        
    })
    return schema.validate(user)
}

function loginValidateUser(user){
    const schema = joi.object({
        email: joi.string().required().email(),
        password: joi.string().min(6).required()
    })
    return schema.validate(user);
}





const users = mongoose.model('user', userSchema);
module.exports = {
    validateUser,
    users,
    loginValidateUser 
}