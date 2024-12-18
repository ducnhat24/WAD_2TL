const Product = require("../schemas/Product");
const Discount = require("../schemas/Discount");
const fs = require("fs");

// Function to convert image to Base64
function imageToBase64(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString("base64");
}

async function seed() {
  try {
    // Clear existing data
    await Product.deleteMany();
    await Discount.deleteMany();

    // Create products
    const products = [
      {
        name: "Orient Vietnam Special Edition RA-AS0106L30B",
        price: 15200000,
        madeIn: "ThaiLand",
        brand: "ORIENT",
        material: "Mineral",
        diameter: "42 mm",
        image:
          "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/332552/orient-ra-as0106l30b-nam-thumb-638684901182925448-600x600.jpg",
      },
      {
        name: "Orient Contemporary RA-TX0302S10B",
        price: 18200000,
        madeIn: "ThaiLand",
        brand: "ORIENT",
        material: "Sapphire",
        diameter: "40 mm",
        image:
          "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/331121/orient-ra-tx0302s10b-nam-thumb-638654688543977798-600x600.jpg",
      },
      {
        name: "Citizen Tsuyosa NJ0150-56W",
        price: 22200000,
        madeIn: "Japan",
        brand: "ORIENT",
        material: "Sapphire",
        diameter: "40 mm",
        image:
          "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/330009/citizen-nj0150-56w-nam-thumb-638629649280996803-600x600.jpg",
      },
      {
        name: " MVW Sport ML062-01",
        price: 591000,
        madeIn: "China",
        brand: "MVW",
        material: "Mineral",
        diameter: "41 mm",
        image: "https://cdn.tgdd.vn/2024/09/timerseo/246098.jpg",
      },
      {
        name: "  MVW Star MSA103-01",
        price: 2490000,
        madeIn: "China",
        brand: "MVW",
        material: "Sapphire",
        diameter: "41.5 mm",
        image:
          "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/332317/mvw-msa103-01-nam-1-638694263571151838-750x500.jpg",
      },
      {
        name: "MVW MS054-01",
        price: 570000,
        madeIn: "China",
        brand: "MVW",
        material: "Mineral",
        diameter: "41 mm",
        image:
          "https://cdn.tgdd.vn/Products/Images/7264/238382/mww-ms054-01-nam-2-750x500.jpg",
      },
      {
        name: "Casio MTP-M305D-1AVDF",
        price: 2410000,
        madeIn: "Japan",
        brand: "CASIO",
        material: "Mineral",
        diameter: "34 mm",
        image:
          "https://cdn.tgdd.vn/Products/Images/7264/311121/casio-mtp-m305d-1avdf-nam-1-750x500.jpg",
      },
      {
        name: "Casio MTP-M305L-7AVDF",
        price: 2756000,
        madeIn: "Japan / Thailand",
        brand: "CASIO",
        material: "Mineral",
        diameter: "34 mm",
        image:
          "https://cdn.tgdd.vn/Products/Images/7264/305812/casio-mtp-m305l-7avdf-nam-1-1-750x500.jpg",
      },
      {
        name: "Casio AE-1200WH-1AVDF",
        price: 790000,
        madeIn: "Japan / Thailand / China",
        brand: "CASIO",
        material: "Glass",
        diameter: "42 mm",
        image:
          "https://cdn.tgdd.vn/Products/Images/7264/199493/casio-ae-1200wh-1avdf-den-1-fix-750x500.jpg",
      },
      {
        name: "G-Shock GA-700MF-1ADR",
        price: 2790000,
        madeIn: "Japan / Thailand ",
        brand: "G-SHOCK",
        material: "Mineral",
        diameter: "53.4 mm",
        image:
          "https://cdn.tgdd.vn/Products/Images/7264/326926/g-shock-ga-700mf-1adr-nam-1-750x500.jpg",
      },
      {
        name: "G-Shock DW-5600AI-1DR",
        price: 33680000,
        madeIn: "Japan / Thailand ",
        brand: "G-SHOCK",
        material: "Mineral",
        diameter: "42.8 mm",
        image:
          "https://cdn.tgdd.vn/Products/Images/7264/326873/fg-shock-dw-5600ai-1dr-nam-1-750x500.jpg",
      },
    ];

    // Save all products
    await Product.insertMany(products);

    // Create a discount
    const discount = new Discount({
      name: "End of Year Sale",
      discount: 10, // 10% off
      startDate: new Date("2024-12-01"),
      endDate: new Date("2024-12-31"),
      products: products.slice(0, 5), // Associate the first 5 products with this discount
    });

    await discount.save();

    console.log("Seed data has been added to the database.");
  } catch (err) {
    console.error("Error seeding data:", err);
  }
}

module.exports = seed;
