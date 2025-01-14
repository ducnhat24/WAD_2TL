const { seedProducts } = require('./seedProducts');
const { seedBrands } = require('./seedBrands');
const { seedCategories } = require('./seedCategories');
const { seedShipping } = require('./seedShipping');
const { seedUsers } = require('./seedUsers');
const { seedCustomers } = require('./seedCustomers');
const { seedOrders } = require('./seedOrders');

async function seed() {
    try {
        await seedOrders();
        await seedCustomers();
        await seedUsers();
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