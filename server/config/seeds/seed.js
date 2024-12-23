const { seedProducts } = require('./seedProducts');
const { seedBrands } = require('./seedBrands');
const { seedCategories } = require('./seedCategories');
const { seedShipping } = require('./seedShipping');

async function seed() {
    try {
        await seedShipping();
        await seedBrands();
        await seedCategories();
        await seedProducts();
        console.log('\x1b[1;32mSeeding completed\x1b[0;0m');
    } catch (error) {
        console.log(error);
    }
}

module.exports = { seed };