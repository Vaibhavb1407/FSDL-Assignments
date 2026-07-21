const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');

const app = express();

//CONNECTING DB
mongoose.connect('mongodb://127.0.0.1:27017/myBlog-DB')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'))

//SCHEMA
let blogSchema = mongoose.Schema({
    title: String,
    image: {
        type: String,
        default: 'imagePlaceholder.jpg' 
    },
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

//MODEL
let Blog = mongoose.model('Blog', blogSchema)

//RESTFUL ROUTES
app.get('/', (req, res) => {
    res.redirect('/blogs')
})

//INDEX ROUTE
app.get('/blogs', async (req, res) => {
    //RETRIEVING ALL BLOGS
    try {
        const blogs = await Blog.find({});
        res.render('index', {blogs: blogs})
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

//NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new')
})

//CREATE ROUTE
app.post('/blogs', async (req, res) => {
    //create blog
    try {
        if (req.body.blog && req.body.blog.body) {
            req.body.blog.body = req.sanitize(req.body.blog.body);
        }
        await Blog.create(req.body.blog);
        //redirect to index page
        res.redirect('/blogs')
    } catch (error) {
        console.error(error);
        res.render('new')
    }
})

//SHOW ROUTE
app.get('/blogs/:id', async (req, res) => {
    try {
        const foundBlog = await Blog.findById(req.params.id);
        if (!foundBlog) return res.redirect('/blogs');
        res.render('show', {blog:foundBlog})
    } catch (error) {
        console.error(error);
        res.redirect('/blogs')
    }
});

//EDIT ROUTE
app.get('/blogs/:id/edit', async (req, res) => {
    try {
        const foundBlog = await Blog.findById(req.params.id);
        if (!foundBlog) return res.redirect('/blogs');
        res.render('edit', {blog:foundBlog})
    } catch (error) {
        console.error(error);
        res.redirect('/blogs')
    }
});

//UPDATE ROUTE
app.put('/blogs/:id', async (req, res) => {
    try {
        if (req.body.blog && req.body.blog.body) {
            req.body.blog.body = req.sanitize(req.body.blog.body);
        }
        await Blog.findByIdAndUpdate(req.params.id, req.body.blog);
        res.redirect('/blogs/' + req.params.id)
    } catch (error) {
        console.error(error);
        res.redirect('/blogs')
    }
});

//DELETE ROUTE
app.delete('/blogs/:id', async (req, res) =>{
    //DESTROY BLOG
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect('/blogs')
    } catch (error) {
        console.error(error);
        res.redirect('/blogs')
    }
});

app.listen(3000, () => {
  console.log('The server is up and running on port 3000')
});