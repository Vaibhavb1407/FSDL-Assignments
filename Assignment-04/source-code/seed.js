const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/used-items-shop')
    .then(() => console.log('Connected to MongoDB for seeding'))
    .catch(err => console.error('MongoDB connection error:', err));

const seedProducts = [
    {
        title: '2020 Toyota Camry LE',
        price: 21500,
        description: 'Excellent condition Toyota Camry. Single owner, well maintained with full service history. Extremely reliable daily driver with great fuel economy. Never been in an accident.',
        category: 'Cars',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 45000,
        condition: 'Excellent',
        image: '/uploads/toyota_camry_1774203698260.png'
    },
    {
        title: '2019 Honda Civic Sport',
        price: 18500,
        description: 'Sporty Honda Civic with a sleek black exterior. Comes with Apple CarPlay, Android Auto, and a sunroof. Has a few minor scratches on the left bumper, but otherwise runs perfectly.',
        category: 'Cars',
        make: 'Honda',
        model: 'Civic',
        year: 2019,
        mileage: 62000,
        condition: 'Good',
        image: '/uploads/honda_civic_1774203717053.png'
    },
    {
        title: '2015 Ford Mustang GT',
        price: 28000,
        description: 'Beautiful 5.0L V8 Ford Mustang GT. Exhaust sounds amazing. Upgraded tires and rims. Needs a little work on the interior upholstery, but mechanically sound.',
        category: 'Cars',
        make: 'Ford',
        model: 'Mustang',
        year: 2015,
        mileage: 85000,
        condition: 'Fair',
        image: '/uploads/ford_mustang_1774203735131.png'
    },
    {
        title: '2022 Yamaha R7',
        price: 8500,
        description: 'Almost brand new Yamaha R7. Aggressive styling and perfect for canyon carving. Has barely been ridden, always garage kept. Comes with a tail tidy and aftermarket exhaust.',
        category: 'Bikes',
        make: 'Yamaha',
        model: 'R7',
        year: 2022,
        mileage: 2500,
        condition: 'Excellent',
        image: '/uploads/yamaha_r7_1774203754309.png'
    },
    {
        title: '2018 Kawasaki Ninja 400',
        price: 4200,
        description: 'Great starter bike! Lightweight, easy to handle, and forgiving. Recently replaced the battery and chain. Ready to ride for the summer.',
        category: 'Bikes',
        make: 'Kawasaki',
        model: 'Ninja 400',
        year: 2018,
        mileage: 18000,
        condition: 'Good',
        image: '/uploads/kawasaki_ninja_1774203773598.png'
    },
    {
        title: '2016 Harley-Davidson Iron 883',
        price: 6500,
        description: 'Classic Harley cruiser. Matte black finish. Comfortable riding position and very loud pipes. Needs a minor service soon, hence the price.',
        category: 'Bikes',
        make: 'Harley-Davidson',
        model: 'Iron 883',
        year: 2016,
        mileage: 22000,
        condition: 'Fair',
        image: '/uploads/harley_davidson_1774203791148.png'
    }
];

const seedDB = async () => {
    try {
        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(seedProducts);
        console.log(`Seeded ${seedProducts.length} new products!`);

    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
