const { seedProducts } = require('./seedProducts');

async function seed() {
    try {
        await seedProducts();
        console.log('\x1b[1m;32mSeeding completed\x1b[0;0m');
    } catch (error) {
        console.log(error);
    }
}

module.exports = { seed };