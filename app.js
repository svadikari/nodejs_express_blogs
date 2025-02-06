const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const session = require('express-session');
const flash = require('connect-flash');

const app = express()

const dbURI = 'mongodb://localhost:27017/blogs'
mongoose.connect(dbURI).then(result => {
    console.log('DB connected successfully');
    app.listen(3000, () => {
        console.log("Appliction started on 3000 port")
    })
}).catch(error => {console.error(error)});

// Middleware
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-changeit',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
app.use(function(req, res, next){
    res.locals.messages = req.flash();
    res.locals.user = req.session.user;
    next();
});

const blogRoute = require('./blogs/blog')
const userRoute = require('./users/user');

app.use('/blogs', blogRoute);
app.use('/users', userRoute);

app.get('/', (req, res) => {
    res.redirect('blogs')
});



