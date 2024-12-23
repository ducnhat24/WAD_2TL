const mongoose = require("mongoose");
const Brand = require("../../components/brand/schema/Brand"); // Update the path to your Brand model

async function seedBrands() {
    const brands = [
        {
            brandName: "ORIENT",
            brandDescription: "A Japanese watch brand known for its high-quality automatic watches.",
            brandCountry: "Japan",
            brandImage: "https://cdnv2.tgdd.vn/mwg-static/common/Category/7264/57/c8/57c879604312ec8902ce2b60024ab601.png",
            officialWebsite: "https://www.orient-watch.com",
        },
        {
            brandName: "CITIZEN",
            brandDescription: "A global leader in watchmaking with eco-friendly technology.",
            brandCountry: "Japan",
            brandImage: "https://www.thegioididong.com/dong-ho-deo-tay-citizen",
            officialWebsite: "https://www.citizenwatch.com",
        },
        {
            brandName: "ELIO",
            brandDescription: "A lesser-known but stylish watch brand for affordable elegance.",
            brandCountry: "Italy",
            brandImage: "https://www.thegioididong.com/dong-ho-deo-tay-elio",
            officialWebsite: "https://www.eliowatches.com",
        },
        {
            brandName: "CASIO",
            brandDescription: "A Japanese electronics company famous for its digital watches.",
            brandCountry: "Japan",
            brandImage: "https://www.thegioididong.com/dong-ho-deo-tay-casio",
            officialWebsite: "https://www.casio.com",
        },
        {
            brandName: "BABY-G",
            brandDescription: "A sub-brand of Casio, designed for women with tough yet trendy styles.",
            brandCountry: "Japan",
            brandImage: "https://www.thegioididong.com/dong-ho-deo-tay-baby-g",
            officialWebsite: "https://www.casio.com/products/watches/baby-g",
        },
        {
            brandName: "G-SHOCK",
            brandDescription: "Known for its shock-resistant watches built for durability.",
            brandCountry: "Japan",
            brandImage: "https://www.thegioididong.com/dong-ho-deo-tay-g-shock",
            officialWebsite: "https://www.gshock.com",
        },
        {
            brandName: "EDOX",
            brandDescription: "A Swiss watch company specializing in precision timepieces.",
            brandCountry: "Switzerland",
            brandImage: "https://www.thegioididong.com/dong-ho-deo-tay-edox",
            officialWebsite: "https://www.edox.ch",
        },
        {
            brandName: "SKMEI",
            brandDescription: "An affordable Chinese brand offering a wide range of digital and analog watches.",
            brandCountry: "China",
            brandImage: "https://www.thegioididong.com/dong-ho-deo-tay-skmei",
            officialWebsite: "https://www.skmei-watch.com",
        },
        {
            brandName: "TITAN",
            brandDescription: "A leading Indian watch brand known for its innovation and craftsmanship.",
            brandCountry: "India",
            brandImage: "https://www.thegioididong.com/dong-ho-deo-tay-titan",
            officialWebsite: "https://www.titan.co.in",
        },
        {
            brandName: "ESPRIT",
            brandDescription: "A fashion brand offering stylish and affordable watches.",
            brandCountry: "USA",
            brandImage: "https://www.thegioididong.com/dong-ho-deo-tay-esprit",
            officialWebsite: "https://www.esprit.com",
        },
        {
            brandName: "Q&Q",
            brandDescription: "A subsidiary of Citizen, offering affordable and reliable watches.",
            brandCountry: "Japan",
            brandImage: "https://www.thegioididong.com/dong-ho-deo-tay-qq",
            officialWebsite: "https://www.qandqwatches.com",
        },
        {
            brandName: "CERTINA",
            brandDescription: "A Swiss brand specializing in sporty, durable, and precise watches.",
            brandCountry: "Switzerland",
            brandImage: "https://www.thegioididong.com/dong-ho-deo-tay-certina",
            officialWebsite: "https://www.certina.com",
        },
    ];

    try {

        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
        console.log('\x1b[0;31mSeeding brands data.....................\x1b[0;0m')
        // Clear existing brands (optional)
        await Brand.deleteMany({});
        await Brand.insertMany(brands);
        console.log('\x1b[0;32mSeed brands data has been added to the database.\x1b[0;0m');
        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
    } catch (error) {
        console.error("Error seeding brands:", error);
    }
};

module.exports = { seedBrands };
