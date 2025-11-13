const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../utils/pathUtils');
const User = require('../Models/userModel'); // Fix variable naming
const colors = require('colors');
// const soilType = require('../Models/SoilModel'); // Fix variable naming
const {ensureAuthenticated} = require('../Config/Auth');
const bcrypt = require('bcryptjs');
const passport = require('passport');
router.get('/login_page', (req, res) => {
    // res.status(200).sendFile(path.join(rootDir, 'views', 'login_page.html'));
    res.status(200).render('login_page');
});

router.post('/login_page', passport.authenticate('local', {
    failureRedirect: '/user/login_page',
    failureFlash: true
}), (req, res) => {
    const stack = req.session.returnToStack || [];
    const redirectTo = stack.length > 0 ? stack.pop() : '/features/recommedation'; // Default redirect if stack is empty
    req.session.returnToStack = stack; // update stack
    res.redirect(redirectTo);
});


// router.post('/login_page', (req, res, next) => {
//     passport.authenticate('local', {
//         successRedirect: req.originalUrl,
//         failureRedirect: '/user/login_page',
//         failureFlash: true
//     })(req, res, next)
//     console.log("Request body: ", req.originalUrl);
// });


router.get('/signup_page', (req, res) => {
    // res.status(200).sendFile(path.join(rootDir, 'views', 'sign_up.html'));
    res.status(200).render('sign_up');
});

router.post('/signup_page', async (req, res) => {
    let errors = [];
    const { userName, phone, address, password, confirm_password} = req.body ;
    if(!userName || !phone || !address || !password || !confirm_password){
        errors.push({message : 'Please fill all fields'});
        res.render('sign_up', {errors, userName, phone, address, password});
    }
    else{
        // validation of all fields
        if(password.length < 6){
            errors.push({message : 'Password must be at least 6 characters long' });
        }
        if(password !== confirm_password){
            errors.push({message : 'Passwords do not match' });
        }
        if(phone.length != 10){
            errors.push({message : 'Phone Number must be of 10 Digits' });
        }
        
    }

    if(errors.length > 0){
        // render the signup form again
        res.render('sign_up', {errors, userName, phone, address, password})
    }
    else{
        try {
            // check if user already exists or not in the database
            const isUser = await User.findOne({phone: phone}); 
            if(isUser){
                errors.push({message : 'Phone Number already exists' });
                return res.render('sign_up', {errors, userName ,phone, address, password})
            }
            
            // hash the password before saving the new user
            const salt =  await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // create the new user
            const newUser = new User({
                userName,
                phone,
                address,
                password: hashedPassword
            });
            await newUser.save();   // save the new user to the database
            console.log("User registered successfully",newUser);
            req.flash('success_msg', 'You are now registered');
            res.redirect('/user/login_page');
        } catch (error) {
            console.error("Server side error".red,error);
            res.status(500).send("Server Error");
        }
    }
});

//  user profile route
router.get('/userProfile', ensureAuthenticated, (req, res) => {
    res.status(200).render('user_page')
});
// visulization routes
// router.get('/visulization', ensureAuthenticated, (req, res) => {
//     res.status(200).render('visual');
// })


// logout routes
router.get('/logout',async (req, res) => {
    try {
        await req.logout((error) => {
            if(error)
                return next(error);
            req.flash('success_msg', 'You are logged out');
            res.redirect('/user/login_page');        
        });
    } catch (error) {
        console.log(error);
        
    }
});
module.exports = router;
