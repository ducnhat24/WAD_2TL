const Customer = require("../schema/Customer"); // Import model Customer
const Product = require("../../product/schema/Product"); // Import model Product

class CartService {
    async addProductToCart({ userID, productID, quantity }) {
        try {
            // Tìm người dùng
            const user = await Customer.findOne({ _id: userID });
            if (!user) {
                return { status: 'error', message: "Customer not found" };
            }

            // const newCartList = user.cart;
            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ chưa
            const cartItem = user.customerCart.find(
                (item) => item.productId.toString() === productID
            );
            console.log(cartItem);

            if (cartItem) {
                // Nếu đã tồn tại, cập nhật số lượng
                cartItem.quantity += quantity;
            } else {
                // Nếu chưa tồn tại, thêm sản phẩm mới
                user.customerCart.push({ productId: productID, quantity });
            }

            // Lưu thay đổi
            await user.save();
            return { status: 'success', message: "Product added to cart", cart: user.customerCart }
        } catch (error) {
            return { status: 'error', message: error.message }
        }

    }
    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ chưa

    async removeProductFromCart({ userID, productID }) {
        try {
            // Tìm người dùng
            console.log(userID);
            console.log(productID);
            const user = await Customer.findOne({ _id: userID });
            if (!user) {
                return { status: 'error', message: "Customer not found" };
            }

            // Lọc bỏ sản phẩm có `productID` ra khỏi giỏ hàng
            const newCart = user.cart.filter(
                (item) => item.productId.toString() !== productID
            );
            user.cart = newCart;

            console.log(user.cart);
            // Lưu thay đổi
            await user.save();
            return { status: 'success', message: "Product removed from cart" };
        } catch (error) {
            return {
                status: 'error',
                message: error.messag,
            }
        }
    }

    async updateProductInCart({ userID, productID, quantity }) {
        try {
            console.log(userID);
            console.log(productID);
            console.log(quantity);
            // Tìm người dùng
            const user = await Customer.findOne({ _id: userID });
            if (!user) {
                return { status: 'error', message: "Customer not found" };
            }

            const newCart = user.cart.map((item) => {
                if (item.productId.toString() === productID) {
                    item.quantity = quantity;
                }
                return item;
            });
            user.cart = newCart;

            // Lưu thay đổi
            await user.save();
            return { status: 'success', message: "Cart updated successfully", cart: user.cart };
        } catch (error) {
            return {
                status: 'error',
                message: error.message,
            }
        }
    }

    async getCart(userID) {
        try {
            // Tìm người dùng
            const user = await Customer.findOne({ _id: userID });
            if (!user) {
                return { status: 'error', message: "Customer not found" };
            }
            // Trả về danh sách sản phẩm ứng với giỏ hàng của người dùng
            // console.log(user);
            if (!user.customerCart) return [];
            const productsInCart = await Promise.all(
                user.customerCart.map(async (item) => {
                    console.log(item);
                    const product = await Product.findOne({ _id: item.productId });
                    return {
                        ...product["_doc"],
                        quantity: item.quantity,
                    };
                })
            );
            const userDisplay = {
                _id: user._id,
                username: user.name,
                useremail: user.email,
            }

            return { status: 'success', user: userDisplay, cart: productsInCart };

        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }
}

module.exports = new CartService;