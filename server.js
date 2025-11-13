const path = require('path');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('./Config/db');
dotenv.config();
const flash = require('connect-flash');
const session = require('express-session');
const colors = require('colors');
const user = require('./Models/userModel');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

//config ejs engine
app.set('view engine', 'ejs');

app.use(express.json()); // ✅ Parses JSON body
app.use(express.urlencoded({ extended: false })); // ✅ Parses form data

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'script')));
app.use(express.static(path.join(__dirname, 'Images')));
// app.use(express.static(path.join(__dirname, 'Demo')));
const rootDir = require('./utils/pathUtils');

// session middleware
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));


// configure passport middleware
const passConfig = require('./passport')(passport);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use flash as middleware
app.use(flash());




// gloabal variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// middleware
app.use((req, res, next) => {
    console.log(`${req.method} ---> ${req.url}\n------------------------------------`.blue)
    next();
})

app.get('/', (req, res) => {
    // res.status(200).sendFile(path.join(rootDir,'views','cover.html'));
    res.status(200).render('cover');
});

app.get('/explore', (req, res) => {
    res.render('explore');
});

// routes.
const userRoutes = require('./routes/userRoutes');
const featuresRoutes = require('./routes/featureRoutes');
app.use('/user', userRoutes);
app.use('/features', featuresRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`.bgGreen);
})