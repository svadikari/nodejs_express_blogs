const express = require('express');
const Blog = require('../models/blog');

const blogRoute = express.Router()

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/users/login'); 
    }
}

blogRoute.get('/', isAuthenticated, async (req, res) => {
    const blogs = await Blog.find().sort({createdAt: -1})
    res.render('home', { blogs: blogs });
});

blogRoute.get('/create', isAuthenticated, (req, res) => {
    res.render('create');
});

blogRoute.post('/create', isAuthenticated, (req, res) => {
    const blog = new Blog(req.body)
    blog.author = req.session.user.username
    blog.save().then(result => {
        res.status(305).redirect('/');
    }).catch(error => { 
        console.log(error);
        res.sendStatus(400).body('Invalid Input');
    });
});

blogRoute.get('/:id', isAuthenticated, async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    res.render('update', { blog: blog });
});

blogRoute.post('/:id', isAuthenticated, async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    blog.title = req.body.title
    blog.details = req.body.details
    blog.save().then(result => {
        req.flash('success', 'Blog updated successfully!');
        res.redirect('/blogs');
    }).catch(error => { 
        console.log(error);
        req.flash('error', 'Blog update failed!');
        res.sendStatus(404).body('Invalid Input');
    });
});

blogRoute.get('/delete/:id', isAuthenticated, async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id).then(result => {
        req.flash('success', 'Blog deleted successfully!');
        res.redirect('/blogs');
    }).catch(error => {
        console.log(error);
        req.flash('error', 'Blog deletion failed!');
        res.sendStatus(404).body('Invalid Blog');
    })
});

module.exports = blogRoute