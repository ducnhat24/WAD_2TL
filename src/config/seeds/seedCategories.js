const mongoose = require("mongoose");
const Category = require("../../components/category/schema/Category"); // Adjust the path as needed

async function seedCategories() {
    const categories = [
        {
            categoryName: "Luxury Watches",
            categoryImage: "https://example.com/images/luxury-watches.jpg",
            categoryDescription:
                "Exclusive luxury watches crafted with precision and elegance. Designed for those who appreciate timeless sophistication.",
        },
        {
            categoryName: "Sports Watches",
            categoryImage: "https://example.com/images/sports-watches.jpg",
            categoryDescription:
                "Watches built for active lifestyles, offering durability, functionality, and style for athletes and adventurers.",
        },
        {
            categoryName: "Casual Watches",
            categoryImage: "https://example.com/images/casual-watches.jpg",
            categoryDescription:
                "Versatile and stylish watches for daily use, offering comfort and affordability without compromising design.",
        },
        {
            categoryName: "Classic Watches",
            categoryImage: "https://example.com/images/classic-watches.jpg",
            categoryDescription:
                "Elegant watches with traditional designs, perfect for formal occasions and lovers of vintage aesthetics.",
        },
        {
            categoryName: "Digital Watches",
            categoryImage: "https://example.com/images/digital-watches.jpg",
            categoryDescription:
                "Feature-rich digital watches offering easy readability and functionality for tech enthusiasts.",
        },
    ];
    try {
        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
        console.log('\x1b[0;31mSeeding categories data.....................\x1b[0;0m')
        await Category.deleteMany(); // Clears the collection
        await Category.insertMany(categories);

        console.log('\x1b[0;32mSeed categories data has been added to the database.\x1b[0;0m');
        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
    } catch (error) {
        console.error("Error seeding categories:", error);
    }
};

module.exports = { seedCategories };
