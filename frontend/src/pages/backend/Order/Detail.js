import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTruck, FaMoneyBillWave, FaUser, FaMapMarkerAlt, FaPhone, FaRegClock, FaEnvelope } from 'react-icons/fa';
import OrderService from '../../../services/OrderService';
import OrderDetailService from '../../../services/OrderDetailService';
import UserService from '../../../services/UserService';
import ProductService from '../../../services/ProductService';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [paymentUpdating, setPaymentUpdating] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isEditingTracking, setIsEditingTracking] = useState(false);
    const [productDetails, setProductDetails] = useState({});

    const ORDER_STATUSES = [
        { value: 'PENDING', label: 'Chờ xử lý', color: 'bg-blue-100 text-blue-800' },
        { value: 'PROCESSING', label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'SHIPPED', label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
        { value: 'DELIVERED', label: 'Đã giao', color: 'bg-green-100 text-green-800' },
        { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
    ];

    const PAYMENT_STATUSES = [
        { value: 'PENDING', label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'PAID', label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
        { value: 'FAILED', label: 'Thanh toán lỗi', color: 'bg-red-100 text-red-800' }
    ];

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                setLoading(true);
                
                // Fetch order data
                const response = await OrderService.getOrderById(id);
                
                // Check if the response exists and has data
                if (!response || !response) {
                    throw new Error("Không tìm thấy thông tin đơn hàng");
                }
                
                const orderData = response;
                setOrder(orderData);
                setTrackingNumber(orderData.trackingNumber || '');
                
                // Fetch order items
                try {
                    const orderItemsResponse = await OrderDetailService.getOrderDetailsByOrderId(id);
                    
                    // Extract the items array properly
                    const itemsArray = Array.isArray(orderItemsResponse.data) ? orderItemsResponse.data : 
                                     (orderItemsResponse.data && orderItemsResponse.data.content ? orderItemsResponse.data.content : []);
                    
                    setOrderItems(itemsArray);
                    
                    // Fetch product details for each item
                    const productIds = itemsArray.map(item => item.product?.id).filter(Boolean);
                    const uniqueProductIds = [...new Set(productIds)];
                    
                    const productDetailsMap = {};
                    
                    await Promise.all(uniqueProductIds.map(async (productId) => {
                        try {
                            const productData = await ProductService.getById(productId);
                            if (productData && productData.data) {
                                productDetailsMap[productId] = productData.data;
                            }
                        } catch (err) {
                            console.error(`Error fetching product details for ID ${productId}:`, err);
                        }
                    }));
                    
                    setProductDetails(productDetailsMap);
                } catch (itemsErr) {
                    console.error("Error fetching order items:", itemsErr);
                    // Don't fail the entire component if items fetch fails
                }
                
                // Fetch user data if userId is available
                if (orderData.userId) {
                    try {
                        const userData = await UserService.getById(orderData.userId);
                        if (userData && userData.data) {
                            setUser(userData.data);
                        }
                    } catch (userErr) {
                        console.error("Error fetching user data:", userErr);
                        // Don't fail the entire component if user fetch fails
                    }
                }
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError(err.message || "Đã xảy ra lỗi khi tải thông tin đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderData();
        } else {
            setError("Không có ID đơn hàng");
            setLoading(false);
        }
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        if (!id || !order) return;
        
        try {
            setStatusUpdating(true);
            const response = await OrderService.updateOrderStatus(id, newStatus);
            if (response && response.data) {
                setOrder({ ...order, orderStatus: newStatus });
                alert("Cập nhật trạng thái đơn hàng thành công!");
            } else {
                throw new Error("Không nhận được phản hồi từ máy chủ");
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            alert(err.message || "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
        } finally {
            setStatusUpdating(false);
        }
    };

    const handlePaymentStatusChange = async (newStatus) => {
        if (!id || !order) return;
        
        try {
            setPaymentUpdating(true);
            const response = await OrderService.updatePaymentStatus(id, newStatus);
            if (response && response.data) {
                setOrder({ ...order, paymentStatus: newStatus });
                alert("Cập nhật trạng thái thanh toán thành công!");
            } else {
                throw new Error("Không nhận được phản hồi từ máy chủ");
            }
        } catch (err) {
            console.error("Error updating payment status:", err);
            alert(err.message || "Có lỗi xảy ra khi cập nhật trạng thái thanh toán");
        } finally {
            setPaymentUpdating(false);
        }
    };

    const handleTrackingUpdate = async () => {
        if (!id || !order) return;
        
        try {
            const response = await OrderService.updateTrackingInfo(id, trackingNumber);
            if (response && response.data) {
                setOrder({ ...order, trackingNumber });
                setIsEditingTracking(false);
                alert("Cập nhật mã vận đơn thành công!");
            } else {
                throw new Error("Không nhận được phản hồi từ máy chủ");
            }
        } catch (err) {
            console.error("Error updating tracking number:", err);
            alert(err.message || "Có lỗi xảy ra khi cập nhật mã vận đơn");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return new Date(dateString).toLocaleDateString('vi-VN', options);
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString;
        }
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return 'N/A';
        
        try {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                .format(amount);
        } catch (e) {
            console.error("Error formatting currency:", e);
            return `${amount} VND`;
        }
    };

    const getStatusColor = (status) => {
        const statusItem = ORDER_STATUSES.find(s => s.value === status);
        return statusItem ? statusItem.color : 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusColor = (status) => {
        const statusItem = PAYMENT_STATUSES.find(s => s.value === status);
        return statusItem ? statusItem.color : 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const statusItem = ORDER_STATUSES.find(s => s.value === status);
        return statusItem ? statusItem.label : 'Không xác định';
    };

    const getPaymentStatusLabel = (status) => {
        const statusItem = PAYMENT_STATUSES.find(s => s.value === status);
        return statusItem ? statusItem.label : 'Không xác định';
    };

    const calculateTotalProductsAmount = () => {
        return orderItems.reduce((total, item) => total + (item.subtotal || item.finalPrice || 0), 0);
    };

    if (loading) {
        return (
            <div className="container mx-auto mt-8 px-4 text-center font-mono">
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    <div className="w-4 h-4 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                </div>
                <p className="text-gray-600 mt-2">Đang tải thông tin đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto mt-8 px-4 font-mono">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <p>{error}</p>
                    </div>
                </div>
                <button 
                    className="mt-4 inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft className="mr-2" /> Quay lại
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto mt-8 px-4 text-center font-mono">
                <p className="text-gray-600">Không tìm thấy thông tin đơn hàng</p>
                <button 
                    className="mt-4 inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft className="mr-2" /> Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-8 px-4 pb-16 font-mono">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <button 
                        className="mr-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded inline-flex items-center"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft className="mr-1" /> Quay lại
                    </button>
                    <h1 className="text-2xl font-medium text-gray-700">
                        <span className="border-b-2 border-blue-500 pb-1">Chi tiết Đơn hàng #{order.id}</span>
                    </h1>
                </div>
                <div className="hidden sm:block">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                    <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusLabel(order.orderStatus)}
                    </span>
                </div>
            </div>

            {/* Order overview and status management */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-6">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-700">Thông tin đơn hàng</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <div className="flex items-start mb-4">
                                <FaRegClock className="text-gray-400 mt-1 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Ngày đặt hàng</p>
                                    <p className="text-gray-800">{formatDate(order.orderDate)}</p>
                                </div>
                            </div>
                            <div className="flex items-start mb-4">
                                <FaMoneyBillWave className="text-gray-400 mt-1 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Tổng tiền</p>
                                    <p className="text-gray-800 font-medium">{formatCurrency(order.totalAmount)}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <FaUser className="text-gray-400 mt-1 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Khách hàng</p>
                                    <p className="text-gray-800">{user ? `${user.fullName || user.username}` : order.username || 'Không có thông tin'}</p>
                                    {user && user.email && (
                                        <p className="text-gray-500 text-sm flex items-center mt-1">
                                            <FaEnvelope className="mr-1" /> {user.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex items-start mb-4">
                                <FaMapMarkerAlt className="text-gray-400 mt-1 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Địa chỉ giao hàng</p>
                                    <p className="text-gray-800">{order.shippingAddress || 'Không có thông tin'}</p>
                                    {order.shippingName && (
                                        <p className="text-gray-600 text-sm mt-1">Người nhận: {order.shippingName}</p>
                                    )}
                                    {order.shippingPhone && (
                                        <p className="text-gray-600 text-sm flex items-center mt-1">
                                            <FaPhone className="mr-1" /> {order.shippingPhone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex items-start mb-4">
                                <FaTruck className="text-gray-400 mt-1 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Mã vận đơn</p>
                                    {isEditingTracking ? (
                                        <div className="flex items-center mt-1">
                                            <input 
                                                type="text" 
                                                className="border border-gray-300 rounded-md px-3 py-1 text-sm mr-2"
                                                value={trackingNumber}
                                                onChange={(e) => setTrackingNumber(e.target.value)}
                                                placeholder="Nhập mã vận đơn..."
                                            />
                                            <button 
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                                                onClick={handleTrackingUpdate}
                                            >
                                                Lưu
                                            </button>
                                            <button 
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs px-2 py-1 rounded ml-1"
                                                onClick={() => {
                                                    setTrackingNumber(order.trackingNumber || '');
                                                    setIsEditingTracking(false);
                                                }}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <p className="text-gray-800">{order.trackingNumber || 'Chưa có'}</p>
                                            <button 
                                                className="ml-2 text-blue-500 hover:text-blue-700"
                                                onClick={() => setIsEditingTracking(true)}
                                                title="Chỉnh sửa"
                                            >
                                                <FaEdit />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {order.notes && (
                                <div className="flex items-start">
                                    <div className="text-gray-400 mt-1 mr-2">📝</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Ghi chú</p>
                                        <p className="text-gray-800">{order.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Management */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-6">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-700">Quản lý trạng thái</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Order Status Management */}
                        <div>
                            <h3 className="text-md font-medium text-gray-700 mb-3">Trạng thái đơn hàng</h3>
                            <div className="flex flex-wrap gap-2">
                                {ORDER_STATUSES.map((status) => (
                                    <button
                                        key={status.value}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                            order.orderStatus === status.value
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        } ${statusUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handleStatusChange(status.value)}
                                        disabled={statusUpdating || order.orderStatus === status.value}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Status Management */}
                        <div>
                            <h3 className="text-md font-medium text-gray-700 mb-3">Trạng thái thanh toán</h3>
                            <div className="flex flex-wrap gap-2">
                                {PAYMENT_STATUSES.map((status) => (
                                    <button
                                        key={status.value}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                            order.paymentStatus === status.value
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        } ${paymentUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handlePaymentStatusChange(status.value)}
                                        disabled={paymentUpdating || order.paymentStatus === status.value}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-700">Chi tiết sản phẩm</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm giá</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orderItems && orderItems.length > 0 ? (
                                orderItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 mr-4">
                                                    {item.product?.imageUrl ? (
                                                        <img 
                                                            src={item.product.imageUrl} 
                                                            alt={item.product.name}
                                                            className="h-10 w-10 rounded-md object-cover border border-gray-200"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/placeholder.png';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.product?.name || 'Sản phẩm không xác định'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        SKU: {item.product?.sku || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            {formatCurrency(item.unitPrice)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            {formatCurrency(item.discountAmount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                            {formatCurrency(item.finalPrice)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        Không có sản phẩm nào trong đơn hàng
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50">
                                <td colSpan="4" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                                    Tổng tiền sản phẩm:
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                    {formatCurrency(calculateTotalProductsAmount())}
                                </td>
                            </tr>
                            {order.shippingFee > 0 && (
                                <tr className="bg-gray-50">
                                    <td colSpan="4" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                                        Phí vận chuyển:
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                        {formatCurrency(order.shippingFee)}
                                    </td>
                                </tr>
                            )}
                            {order.discount > 0 && (
                                <tr className="bg-gray-50">
                                    <td colSpan="4" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                                        Khuyến mãi:
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                                        -{formatCurrency(order.discount)}
                                    </td>
                                </tr>
                            )}
                            <tr className="bg-gray-100">
                                <td colSpan="4" className="px-6 py-4 text-base font-medium text-gray-900 text-right">
                                    Tổng thanh toán:
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-blue-600 text-right">
                                    {formatCurrency(order.totalAmount)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;