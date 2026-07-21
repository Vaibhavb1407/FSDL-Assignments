const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// GET /products - Show all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('index', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET /products/new - Show form to add new product
router.get('/new', (req, res) => {
    res.render('new');
});

// POST /products - Create new product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, price, description, category, make, model, year, mileage, condition } = req.body;
        const image = req.file ? '/uploads/' + req.file.filename : '';
        const newProduct = new Product({ title, price, description, category, image, make, model, year, mileage, condition });
        await newProduct.save();
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to create product');
    }
});

// GET /products/:id - Show product details
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('show', { product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET /products/:id/edit - Show form to edit product
router.get('/:id/edit', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('edit', { product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// PUT /products/:id - Update product
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, price, description, category, make, model, year, mileage, condition } = req.body;
        const updateData = { title, price, description, category, make, model, year, mileage, condition };

        if (req.file) {
            updateData.image = '/uploads/' + req.file.filename;
        }

        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect(`/products/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update product');
    }
});

// DELETE /products/:id - Delete product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete product');
    }
});

module.exports = router;
