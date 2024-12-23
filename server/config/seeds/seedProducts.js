const Product = require('../../components/product/schema/Product');
const Brand = require('../../components/brand/schema/Brand');
const Category = require('../../components/category/schema/Category');
const productRouter = require('../../components/product/route/product');
// // Function to convert image URL to Base64
// async function imageToBase64(url) {
//     try {
//         const response = await axios.get(url, { responseType: 'arraybuffer' });
//         const base64 = Buffer.from(response.data, 'binary').toString('base64');
//         return base64;
//     } catch (error) {
//         console.error('Error converting image to Base64:', error.message);
//         return null;
//     }
// }

async function seedProducts() {
    const brands = await Brand.find({});
    const brandsMap = brands.reduce((map, brand) => {
        map[brand.brandName] = brand._id;
        return map;
    }, {});
    const categories = await Category.find({});
    const categoriesMap = categories.reduce((map, category) => {
        map[category.categoryName] = category._id;
        return map;
    }, {});

    const products = [
        {
            productName: "Orient Contemporary RA-TX0302S10B",
            productPrice: 6922000,
            productDescription: "Orient Contemporary RA-TX0302S10B is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["ORIENT"],
            productYear: 2021,
            productMainImage: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/331121/orient-ra-tx0302s10b-nam-thumb-638654688543977798-600x600.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/331121/orient-ra-tx0302s10b-nam-2-638654688646831410-750x500.jpg',
                'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/331121/orient-ra-tx0302s10b-nam-3-638654688652995020-750x500.jpg',
                'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/331121/orient-ra-tx0302s10b-nam-6-638654688663070762-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Stainless steel",
                productSize: "40mm",
            },
            productMadeIn: "Japan",
            productQuantity: 10,
            productCategory: categoriesMap["Luxury Watches"],
        },
        {
            productName: "Citizen Tsuyosa NJ0152-51X",
            productPrice: 10263000,
            productDescription: "Citizen Tsuyosa NJ0152-51X is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["CITIZEN"],
            productYear: 2020,
            productMainImage: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/330001/citizen-nj0152-51x-nam-1-638629597821954665-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/330001/citizen-nj0152-51x-nam-2-638629597827422902-750x500.jpg',
                'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/330001/citizen-nj0152-51x-nam-3-638629597834248402-750x500.jpg',
                'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/330001/citizen-nj0152-51x-nam-9-638629597846393245-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Stainless steel",
                productSize: "40mm",
            },
            productMadeIn: "Japan",
            productQuantity: 12,
            productCategory: categoriesMap["Luxury Watches"],
        },
        {
            productName: "Orient Vietnam Special Edition RA-AS0106L30B",
            productPrice: 15200000,
            productDescription: "Orient Vietnam Special Edition RA-AS0106L30B is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["ORIENT"],
            productYear: 2020,
            productMainImage: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/332552/orient-ra-as0106l30b-nam-1-638684901280757694-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/332552/orient-ra-as0106l30b-nam-2-638684901290354468-750x500.jpg',
                'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/332552/orient-ra-as0106l30b-nam-3-638684901300464092-750x500.jpg',
                'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/332552/orient-ra-as0106l30b-nam-4-638684901306066914-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Stainless steel",
                productSize: "41.5mm",
            },
            productMadeIn: "Japan",
            productQuantity: 20,
            productCategory: categoriesMap["Casual Watches"],
        },
        {
            productName: "Elio Starlight ES176-01",
            productPrice: 890000,
            productDescription: "Elio Starlight ES176-01 is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["ELIO"],
            productYear: 2023,
            productMainImage: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/329919/elio-es176-01-nu-1-638632064837195554-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/329919/elio-es176-01-nu-2-638632064847338993-750x500.jpg',
                'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/329919/elio-es176-01-nu-7-638632064854362829-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Stainless steel",
                productSize: "33mm",
            },
            productMadeIn: "Vietnam",
            productQuantity: 30,
            productCategory: categoriesMap["Classic Watches"],
        },
        {
            productName: "Casio MTP-M305D-1AVDF",
            productPrice: 2412000,
            productDescription: "Casio MTP-M305D-1AVDF is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["CASIO"],
            productYear: 2023,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/311121/casio-mtp-m305d-1avdf-nam-1-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/311121/casio-mtp-m305d-1avdf-nam-2-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/311121/casio-mtp-m305d-1avdf-nam-3-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/311121/casio-mtp-m305d-1avdf-nam-4-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/311121/casio-mtp-m305d-1avdf-nam-5-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Stainless steel",
                productSize: "34mm",
            },
            productMadeIn: "Japan",
            productQuantity: 15,
            productCategory: categoriesMap["Digital Watches"],
        },
        {
            productName: "Baby-G BGD-565SJ-7DR",
            productPrice: 2412000,
            productDescription: "Baby-G BGD-565SJ-7DR is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["BABY-G"],
            productYear: 2024,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/326941/baby-g-bgd-565sj-7dr-nu-1-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/326941/baby-g-bgd-565sj-7dr-nu-2-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/326941/baby-g-bgd-565sj-7dr-nu-4-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/326941/baby-g-bgd-565sj-7dr-nu-5-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/326941/baby-g-bgd-565sj-7dr-nu-6-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Polyurethane",
                productSize: "37.9mm",
            },
            productMadeIn: "Japan",
            productQuantity: 15,
            productCategory: categoriesMap["Digital Watches"],
        },
        {
            productName: "Baby-G BGA-320-4ADR",
            productPrice: 2754000,
            productDescription: "Baby-G BGA-320-4ADR is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["BABY-G"],
            productYear: 2022,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/313966/baby-g-bga-320-4adr-nu-1-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/313966/baby-g-bga-320-4adr-nu-2-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/313966/baby-g-bga-320-4adr-nu-3-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/313966/baby-g-bga-320-4adr-nu-4-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/313966/baby-g-bga-320-4adr-nu-5-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Polyurethane",
                productSize: "42.4mm",
            },
            productMadeIn: "Japan",
            productQuantity: 12,
            productCategory: categoriesMap["Digital Watches"],
        },

        {
            productName: "G-Shock GA-700MF-1ADR",
            productPrice: 2792000,
            productDescription: "G-Shock GA-700MF-1ADR is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["G-SHOCK"],
            productYear: 2022,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/313966/baby-g-bga-320-4adr-nu-1-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/313966/baby-g-bga-320-4adr-nu-2-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/313966/baby-g-bga-320-4adr-nu-3-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/313966/baby-g-bga-320-4adr-nu-4-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/313966/baby-g-bga-320-4adr-nu-5-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Resin",
                productSize: "54.2mm",
            },
            productMadeIn: "Japan",
            productQuantity: 12,
            productCategory: categoriesMap["Sports Watches"],
        },

        {
            productName: "Edox Delfin 10112-3BUM-BUIN",
            productPrice: 22612000,
            productDescription: "Edox Delfin 10112-3BUM-BUIN is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["EDOX"],
            productYear: 2024,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/325957/edox-10112-3bum-buin-nam-1-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/325957/edox-10112-3bum-buin-nam-2-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/325957/edox-10112-3bum-buin-nam-3-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/325957/edox-10112-3bum-buin-nam-5-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Stainless steel",
                productSize: "43mm",
            },
            productMadeIn: "Switzerland",
            productQuantity: 5,
            productCategory: categoriesMap["Luxury Watches"],
        },

        {
            productName: "Edox CO-1 10242-TINRCA-BRDR",
            productPrice: 33132000,
            productDescription: "Edox CO-1 10242-TINRCA-BRDR is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["EDOX"],
            productYear: 2024,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/325959/edox-10242-tinrca-brdr-nam-1-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/325959/edox-10242-tinrca-brdr-nam-2-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/325959/edox-10242-tinrca-brdr-nam-3-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/325959/edox-10242-tinrca-brdr-nam-5-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Natural rubber",
                productSize: "45mm",
            },
            productMadeIn: "Switzerland",
            productQuantity: 5,
            productCategory: categoriesMap["Luxury Watches"],
        },

        {
            productName: "Edox CO-1 10242-TINRCA-BRDR",
            productPrice: 33132000,
            productDescription: "Edox CO-1 10242-TINRCA-BRDR is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["EDOX"],
            productYear: 2024,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/325959/edox-10242-tinrca-brdr-nam-1-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/325959/edox-10242-tinrca-brdr-nam-2-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/325959/edox-10242-tinrca-brdr-nam-3-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/325959/edox-10242-tinrca-brdr-nam-5-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Natural rubber",
                productSize: "45mm",
            },
            productMadeIn: "Switzerland",
            productQuantity: 5,
            productCategory: categoriesMap["Luxury Watches"],
        },

        {
            productName: "SKMEI SK-1240",
            productPrice: 132000,
            productDescription: "SKMEI SK-1240 is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["SKMEI"],
            productYear: 2019,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/224935/sk-1240-hong-dam-2-2-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/224935/sk-1240-hong-dam-4-1-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/224935/sk-1240-hong-dam-min-5-700x467.jpeg',
                'https://cdn.tgdd.vn/Products/Images/7264/224935/sk-1240-hong-dam-6-1-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "ABS",
                productSize: "22mm",
            },
            productMadeIn: "China",
            productQuantity: 10,
            productCategory: categoriesMap["Casual Watches"],
        },

        {
            productName: "SKMEI SK-1455",
            productPrice: 290000,
            productDescription: "SSKMEI SK-1455 is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["SKMEI"],
            productYear: 2019,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/197724/skmei-sk-1455-hong-xanh-5-org-1-700x467.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/197724/skmei-sk-1455-hong-xanh-6-org-1-700x467.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/197724/skmei-sk-1455-hong-xanh-3-3-700x467.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/197724/skmei-sk-1455-hong-xanh-4-4-700x467.jpg',
            ],
            productDetailInformation: {
                productMaterial: "ABS",
                productSize: "37.6mm",
            },
            productMadeIn: "China",
            productQuantity: 10,
            productCategory: categoriesMap["Casual Watches"],
        },

        {
            productName: "TITAN 2554SL01",
            productPrice: 420000,
            productDescription: "TITAN 2554SL01 is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["TITAN"],
            productYear: 2021,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/205080/titan-2554sl01-nu-1-1-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/205080/titan-2554sl01-nu-2-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/205080/titan-2554sl01-nu-3-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Leather",
                productSize: "33mm",
            },
            productMadeIn: "India",
            productQuantity: 15,
            productCategory: categoriesMap["Sports Watches"],
        },

        {
            productName: "TITAN 1767SL01",
            productPrice: 412000,
            productDescription: "TITAN 1767SL01 is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["TITAN"],
            productYear: 2022,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/205036/titan-1767sl01-nam-5-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/205036/titan-1767sl01-nam-6-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/205036/titan-1767sl01-nam-7-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/205036/titan-1767sl01-nam-8-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Leather",
                productSize: "42mm",
            },
            productMadeIn: "India",
            productQuantity: 15,
            productCategory: categoriesMap["Classic Watches"],
        },

        {
            productName: "TITAN 2457YL01",
            productPrice: 412000,
            productDescription: "TITAN 2457YL01 is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["TITAN"],
            productYear: 2022,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/205079/titan-2457yl01-nu-cont-1-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/205079/titan-2457yl01-nu-cont-2-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/205079/titan-2457yl01-nu-cont-3-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/205079/titan-2457yl01-nu-cont-4-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Leather",
                productSize: "20m",
            },
            productMadeIn: "India",
            productQuantity: 10,
            productCategory: categoriesMap["Classic Watches"],
        },

        {
            productName: "ESPRIT ES1L215M0085",
            productPrice: 790000,
            productDescription: "ESPRIT ES1L215M0085 is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["ESPRIT"],
            productYear: 2024,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/239028/esprit-es1l215m0085-nu1-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/239028/esprit-es1l215m0085-nu2-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/239028/esprit-es1l215m0085-nu3-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Alloy",
                productSize: "36m",
            },
            productMadeIn: "America",
            productQuantity: 15,
            productCategory: categoriesMap["Classic Watches"],
        },

        {
            productName: "ESPRIT ES1L314M0145",
            productPrice: 790000,
            productDescription: "ESPRIT ES1L314M0145 is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["ESPRIT"],
            productYear: 2022,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/250462/esprit-es1l314m0145-nu-1-700x467.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/250462/esprit-es1l314m0145-nu-2-700x467.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/250462/esprit-es1l314m0145-nu-3-700x467.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Stainless steel",
                productSize: "32m",
            },
            productMadeIn: "America",
            productQuantity: 15,
            productCategory: categoriesMap["Classic Watches"],
        },

        {
            productName: "Q&Q VP35J073Y",
            productPrice: 290000,
            productDescription: "Q&Q VP35J073Y is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["Q&Q"],
            productYear: 2022,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/216134/q-q-vp35j073y-nu-3-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/216134/q-q-vp35j073y-nu-4-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/216134/q-q-vp35j073y-nu-5-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/216134/q-q-vp35j073y-nu-6-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Plastic",
                productSize: "23.5m",
            },
            productMadeIn: "Japan",
            productQuantity: 12,
            productCategory: categoriesMap["Classic Watches"],
        },

        {
            productName: "Q&Q GW87J010Y",
            productPrice: 290000,
            productDescription: "Q&Q GW87J010Y is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["Q&Q"],
            productYear: 2022,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/325855/q-q-gw87j010y-nam-1-750x500.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/325855/q-q-gw87j010y-nam-2-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/325855/q-q-gw87j010y-nam-3-750x500.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/325855/q-q-gw87j010y-nam-5-750x500.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Silicone",
                productSize: "52m",
            },
            productMadeIn: "Japan",
            productQuantity: 12,
            productCategory: categoriesMap["Classic Watches"],
        },

        {
            productName: "CERTINA Aqua C032.407.11.041.00",
            productPrice: 290000,
            productDescription: "CERTINA Aqua C032.407.11.041.00 is a modern watch that is perfect for any occasion. It has a sleek design that is perfect for any outfit.",
            productBrand: brandsMap["CERTINA"],
            productYear: 2024,
            productMainImage: 'https://cdn.tgdd.vn/Products/Images/7264/245624/certina-c032-407-11-041-00-nam-1-700x467.jpg',
            productStatus: "In stock",
            productRelatedImages: [
                'https://cdn.tgdd.vn/Products/Images/7264/245624/certina-c032-407-11-041-00-nam-3-700x467.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/245624/certina-c032-407-11-041-00-nam-4-700x467.jpg',
                'https://cdn.tgdd.vn/Products/Images/7264/245624/certina-c032-407-11-041-00-nam-5-700x467.jpg',
            ],
            productDetailInformation: {
                productMaterial: "Stainless steel",
                productSize: "43m",
            },
            productMadeIn: "Switzerland",
            productQuantity: 12,
            productCategory: categoriesMap["Luxury Watches"],
        },
    ]
    try {
        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
        console.log('\x1b[0;31mSeeding product data.....................\x1b[0;0m')
        await Product.deleteMany({});

        await Product.insertMany(products);

        console.log('\x1b[0;32mSeed product data has been added to the database.\x1b[0;0m');
        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
    } catch (err) {
        console.error('Error seeding data:', err);
    }
}

module.exports = { seedProducts };
