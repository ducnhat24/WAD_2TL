const mongoose = require('mongoose');
const Order = require('../../components/customer/schema/Order');

async function seedOrders() {
    try {

        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
        console.log('\x1b[0;31mSeeding orders data.....................\x1b[0;0m')
        // Clear existing brands (optional)
        await Order.deleteMany({});
        console.log('\x1b[0;32mSeed orders data has been added to the database.\x1b[0;0m');
        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
    } catch (error) {
        console.error("Error seeding brands:", error);
    }
}

module.exports = { seedOrders };