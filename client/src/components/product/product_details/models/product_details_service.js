

class ProductDetailsService {
    async getProductDetails(id) {
        try {
            const response = await fetch(`http://localhost:3000/product/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data.data[0].productName);
            return data;
        } catch (err) {
            console.log(err.message);
            return null;
        }
    }
    
    async getSameProducts(brand, category) {
        try {
            //fetch all products 
            const response = await fetch("http://localhost:3000/product/", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                const responseJson = await response.json();
                const allSameProducts = responseJson.data.filter((p) => p.brandName === brand || p.categoryName === category);
                if (allSameProducts.length > 3) {
                    return allSameProducts.slice(0, 3);
                }
                return allSameProducts;
            }
        }
        catch (error) {
            console.error(error);
            throw new Error("An error occurred while fetching similar products");
        }
    }
}

module.exports = new ProductDetailsService;