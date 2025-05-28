import httpAxios from "./httpAxios";

/**
 * Handle API errors
 */
const handleError = (error) => {
    console.error("Order API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "An error occurred while processing your order request." };
};

const OrderService = {
    /**
     * Create a new order
     */
    createOrder: (orderData) => {
        return httpAxios.post('orders', orderData);
    },
    /**
     * Get order by ID
     */
    getOrderById: async (id) => {
        try {
            const response = await httpAxios.get(`orders/${id}`);
            return response;
        } catch (error) {
            handleError(error);
        }
    },

    /**
     * Get all orders for a user
     */
    getUserOrders: async (userId) => {
        try {
            const response = await httpAxios.get(`orders/user/${userId}`);
            return response.data || [];
        } catch (error) {
            console.error("Error fetching user orders:", error);
            return [];
        }
    },

    /**
     * Get all orders
     */
    getAllOrders: async () => {
    try {
        const response = await httpAxios.get("orders");
        console.log("Raw API response:", response);

        if (!response || !response) {
            console.warn("API returned null or undefined data");
            return [];
        }

        // Kiểm tra đúng trường "orders"
        const orders = response.orders;
        if (Array.isArray(orders)) {
            return orders;
        } else {
            console.warn("Không tìm thấy mảng orders trong response:", response);
            return [];
        }
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return [];
    }
},


    /**
     * Search orders
     */
    searchOrders: async (searchTerm) => {
        try {
            const response = await httpAxios.get(`orders/search?term=${searchTerm}`);
            return response.data || [];
        } catch (error) {
            console.error("Error searching orders:", error);
            return [];
        }
    },

    /**
     * Update order status
     */
    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await httpAxios.put(`orders/${orderId}/status?status=${status}`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    /**
     * Update payment status
     */
    updatePaymentStatus: async (orderId, status) => {
        try {
            const response = await httpAxios.put(`orders/${orderId}/payment?status=${status}`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    /**
     * Update tracking information
     */
    updateTrackingInfo: async (orderId, trackingNumber) => {
        try {
            const response = await httpAxios.put(`orders/${orderId}/tracking?trackingNumber=${trackingNumber}`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    /**
     * Cancel an order
     */
    cancelOrder: async (orderId) => {
        try {
            const response = await httpAxios.put(`orders/${orderId}/cancel`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    /**
     * Move order to trash (soft delete)
     */
    moveToTrash: async (orderId) => {
        try {
            const response = await httpAxios.delete(`orders/${orderId}`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    /**
     * Restore order from trash
     */
    restoreFromTrash: async (orderId) => {
        try {
            const response = await httpAxios.put(`orders/${orderId}/restore`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    /**
     * Get recent orders
     */
    getRecentOrders: async (limit = 5) => {
        try {
            const response = await httpAxios.get(`orders/recent?limit=${limit}`);
            return response.data || [];
        } catch (error) {
            console.error("Error fetching recent orders:", error);
            return [];
        }
    },

    /**
     * Get order statistics
     */
    getOrderStats: async () => {
        try {
            const response = await httpAxios.get("orders/status");
            return response.data || {};
        } catch (error) {
            console.error("Error fetching order stats:", error);
            return {};
        }
    }
};

export default OrderService;