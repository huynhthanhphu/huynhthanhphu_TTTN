import httpAxios from './httpAxios';

const CartService = {
    // Get cart by user ID
    getCartByUser: (userId) => {
        return httpAxios.get(`cart/user/${userId}`);
    },
    
    clear: (userId) => {
        return httpAxios.delete(`/api/cart/clear/${userId}`);
    },

    // Add product to cart
    addToCart: (userId, productId, quantity = 1) => {
        return httpAxios.post(`cart/add`, { userId, productId, quantity });
    },

    // Update product quantity in cart
    changeQuantity: (cartId, quantity) => {
        return httpAxios.put(`cart/update/${cartId}?quantity=${quantity}`);
    },

    // Remove product from cart
    delete: (cartId) => {
        return httpAxios.delete(`cart/delete/${cartId}`);
    },

    // Clear all products from user's cart
    clear: (userId) => {
        return httpAxios.delete(`cart/clear/${userId}`);
    },

    // Check if product exists in cart
    checkProductInCart: (userId, productId) => {
        return httpAxios.get(`cart/check-product`, {
            params: { userId, productId }
        });
    },

    getCartItemCount: (userId) => {
        return httpAxios.get(`cart/count/${userId}`);
    }
};

export default CartService;