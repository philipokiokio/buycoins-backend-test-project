const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const bcrypt = require('bcrypt');
const {users } = require("../models/users.mongo");
require('dotenv').config()


function jwtPassport(passport){
    const opts = {} 
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey =process.env.secret
    passport.use(new jwtStrategy(opts, function(jwt_payload, done){
        users.findOne({id: jwt_payload.id}, function(err, user){
            if(err){
                return done(err, false);

            }
            if (user){
                done(null, user);
            }else{
                done(null, false);
            }

        });
    }));
}

module.exports = {
    jwtPassport,
}