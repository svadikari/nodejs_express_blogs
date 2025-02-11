const express = require('express');
const userRoute = express.Router();
const { getUserProfile, updateUserProfile, loginUser, registerUser, logoutUser } = require('./controller');
const isAuthenticated = require('../utils/auth');

userRoute.get('/login', (req, res) => res.render('login'));
userRoute.post('/login', loginUser);
userRoute.get('/logout',isAuthenticated, logoutUser);
userRoute.get('/register', (req, res) => res.render('register'));
userRoute.post('/register', registerUser);
userRoute.get('/profile/:id', isAuthenticated, getUserProfile);
userRoute.post('/profile/:id', isAuthenticated, updateUserProfile);

module.exports = userRoute