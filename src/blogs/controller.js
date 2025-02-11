const Blog = require('../models/blog');

const getAllBlogs = async (req, res) => {
    const blogs = await Blog.find().sort({createdAt: -1})
    res.render('home', { blogs: blogs });
};

const createBlog = (req, res) => {
    const blog = new Blog(req.body)
    blog.author = req.session.user.username
    blog.save().then(result => {
        res.redirect('/');
    }).catch(error => { 
        console.log(error);
        res.sendStatus(400).body('Invalid Input');
    });
};

const getBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    res.render('update', { blog: blog });
};

const updateBlog = async (req, res) => {
    let blog = await Blog.findById(req.params.id)
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
};

const deleteBlog = (req, res) => {
    Blog.findByIdAndDelete(req.params.id).then(result => {
        req.flash('success', 'Blog deleted successfully!');
        res.redirect('/blogs');
    }).catch(error => {
        console.log(error);
        req.flash('error', 'Blog deletion failed!');
        res.sendStatus(404).body('Invalid Blog');
    })
};
module.exports = {
    getAllBlogs,
    createBlog,
    getBlog,
    updateBlog,
    deleteBlog,
}