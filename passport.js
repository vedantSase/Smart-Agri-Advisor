const localStrategy = require('passport-local').Strategy ;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Models/userModel');

module.exports = function (passport) {
    passport.use(
        new localStrategy({ usernameField: 'phone' }, async (phone, password, done) => {
            try {
                // find the user in the database
                const user = await User.findOne({ phone });
                // if the user is not found then generate message
                if (!user) {
                    return done(null, false, { message: 'Phone is not registered' }); 
                }

                // if user found then check for its respected password
                const isMatch = await bcrypt.compare(password, user.password);
                if(!isMatch) {
                    return done(null, false, { message: 'wrong password' });
                }
                else{
                    return done(null, user);
                }
            }   
            catch (err){
                console.error(err);
            }
        })
    )
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser( async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
            }
        catch (error) {
            done(error, null);
        }
        
    });
}; 