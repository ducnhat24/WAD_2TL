const mongoose = require("mongoose");
const Shipping = require("../../components/shipping/schema/Shipping"); // Adjust path if necessary

// Sample shipping data to seed
async function seedShipping() {
    const seedShipping = [
        {
            shippingName: "Standard Shipping",
            shippingDescription: "Delivers in 5-7 business days.",
            shippingFee: 20000,
        },
        {
            shippingName: "Expedited Shipping",
            shippingDescription: "Delivers in 2-3 business days.",
            shippingFee: 27000,
        },
        {
            shippingName: "Overnight Shipping",
            shippingDescription: "Delivers the next day.",
            shippingFee: 40000,
        },
        {
            shippingName: "International Shipping",
            shippingDescription: "Delivers in 7-14 business days internationally.",
            shippingFee: 50000,
        },
    ];

    try {
        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
        console.log('\x1b[0;31mSeeding shipping method data.....................\x1b[0;0m')

        await Shipping.deleteMany({});

        await Shipping.insertMany(seedShipping);

        console.log('\x1b[0;32mSeed shipping method data has been added to the database.\x1b[0;0m');
        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
    } catch (error) {
        console.error("Error seeding shipping:", error);
    }

}

module.exports = { seedShipping };

