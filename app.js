const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const session = require('express-session');
const flash = require('connect-flash');

const app = express()
if (process.env.NODE_ENV !== 'test') {
    const dbURI = 'mongodb://localhost:27017/blogs'
    const port = process.env.PORT || 3000;
    mongoose.connect(dbURI).then(result => {
        app.listen(port, () => {
            console.log("Appliction started on "+port+" port")
        })
    }).catch(error => { console.error(error) });
}


// Middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json());
app.set('views', './src/views');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret-changeit',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = req.flash();
    res.locals.user = req.session.user;
    next();
});

const blogRoute = require('./src/blogs/routes');  // Import the blog route
const userRoute = require('./src/users/routes');  // Import the user route

app.use('/blogs', blogRoute);
app.use('/users', userRoute);

app.get('/', (req, res) => {
    res.redirect('blogs')
});

module.exports = app;

