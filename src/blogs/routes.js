const express = require('express');
const blogRoute = express.Router()
const {getAllBlogs, createBlog, getBlog, updateBlog, deleteBlog} = require('./controller');
const isAuthenticated = require('../utils/auth');

blogRoute.get('/', isAuthenticated, getAllBlogs);
blogRoute.get('/create', isAuthenticated, (req, res) => {res.render('create');});
blogRoute.post('/create', isAuthenticated, createBlog);
blogRoute.get('/:id', isAuthenticated, getBlog);
blogRoute.post('/:id', isAuthenticated, updateBlog);
blogRoute.get('/delete/:id', isAuthenticated, deleteBlog);

module.exports = blogRoute