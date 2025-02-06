const express = require('express');
const User = require('../models/user');

const userRoute = express.Router();


userRoute.get('/login', (req, res) => {
    res.render('login');
});

userRoute.post('/login', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        req.flash('error', 'Username/password required.');
    }
    const user = await User.findOne({username: req.body.username});
    if (user && user.password === req.body.password) {
        req.flash('success', 'Login successful!');
        req.session.user = {id: user.id, firstName: user.firstName, username: user.username}
        res.redirect('/blogs');
    } else {
        req.flash('error', 'Invalid credentials.');
        res.render('login');
    }
});

// Logout route
userRoute.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/users/login');
  });

userRoute.get('/register', (req, res) => {
    res.render('register');
});

userRoute.post('/register', (req, res) => {
    const user = new User(req.body)
    user.save().then(result => {
        req.flash('success', 'Successfully Registerd! Please Login!');
        res.status(305).redirect('/');
    }).catch(error => {
        console.log(error);
        req.flash('error', 'Invalid Input.');
        res.sendStatus(400).body('Invalid Input');
    });
});

userRoute.get('/profile/:id', async (req, res) => {
    await User.findById(req.params.id).then(user => {
        res.render('profile', {user: user});
    }).catch(error => {
        res.render('404', {error: error});
    })
});

userRoute.post('/profile/:id', async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id, // The ID of the document to update
        { firstName: req.body.firstName, lastName: req.body.lastName }, // The fields to update
        { new: true, returnDocument: "after" });//, // Set to true to return the updated document
    if(updatedUser) {
        req.flash('success','Profile has been updated successfully!')
        req.session.user = {id: updatedUser.id, firstName: updatedUser.firstName, username: updatedUser.username}
        res.redirect('/blogs');
    }else {
        console.error(err);
        req.flash('error', 'Failed to update profile!');
    }
});

module.exports = userRoute