import React from 'react';
import { 
  Users, ShoppingBag, DollarSign, TrendingUp, ChevronRight, 
  Package, FileText, AlertCircle, Eye, Clock
} from 'lucide-react';

const Dashboard = () => {
  // Sample data for the dashboard
  const stats = [
    { title: 'Doanh thu', value: '120.500.000 ₫', icon: DollarSign, change: '+12%', color: 'bg-green-100 text-green-800' },
    { title: 'Đơn hàng', value: '254', icon: ShoppingBag, change: '+5%', color: 'bg-blue-100 text-blue-800' },
    { title: 'Khách hàng', value: '1,204', icon: Users, change: '+18%', color: 'bg-purple-100 text-purple-800' },
    { title: 'Lượt truy cập', value: '45,729', icon: Eye, change: '+24%', color: 'bg-amber-100 text-amber-800' },
  ];

  const recentOrders = [
    { id: 'ORD-1234', customer: 'Nguyễn Văn A', date: '08/04/2025', amount: '1,200,000 ₫', status: 'Đã thanh toán' },
    { id: 'ORD-1233', customer: 'Trần Thị B', date: '07/04/2025', amount: '850,000 ₫', status: 'Đang giao hàng' },
    { id: 'ORD-1232', customer: 'Lê Văn C', date: '06/04/2025', amount: '2,100,000 ₫', status: 'Đã giao hàng' },
    { id: 'ORD-1231', customer: 'Phạm Thị D', date: '05/04/2025', amount: '750,000 ₫', status: 'Chờ xử lý' },
    { id: 'ORD-1230', customer: 'Hoàng Văn E', date: '04/04/2025', amount: '1,550,000 ₫', status: 'Đã hủy' },
  ];

  const popularProducts = [
    { name: 'iPhone 14 Pro', sold: 124, stock: 28, price: '28,000,000 ₫' },
    { name: 'Samsung Galaxy S23', sold: 98, stock: 15, price: '22,500,000 ₫' },
    { name: 'iPad Air', sold: 87, stock: 32, price: '16,000,000 ₫' },
    { name: 'MacBook Air M2', sold: 76, stock: 18, price: '32,000,000 ₫' },
  ];

  const recentNotifications = [
    { text: 'Đơn hàng mới #ORD-1234 cần được xử lý', time: 'Vừa xong' },
    { text: '5 sản phẩm sắp hết hàng', time: '30 phút trước' },
    { text: 'Cập nhật phiên bản mới của hệ thống', time: '2 giờ trước' },
    { text: '3 liên hệ mới từ khách hàng', time: '3 giờ trước' },
  ];

  const getStatusClass = (status) => {
    switch(status) {
      case 'Đã thanh toán': return 'bg-green-100 text-green-800';
      case 'Đang giao hàng': return 'bg-blue-100 text-blue-800';
      case 'Đã giao hàng': return 'bg-green-100 text-green-800';
      case 'Chờ xử lý': return 'bg-yellow-100 text-yellow-800';
      case 'Đã hủy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h2>
          <p className="text-gray-600 mt-1">Xin chào, chào mừng trở lại!</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200">
            Xuất báo cáo
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                <div className={`${stat.color} text-xs font-medium px-2 py-1 rounded-full inline-flex items-center mt-2`}>
                  <TrendingUp size={12} className="mr-1" />
                  {stat.change} so với tháng trước
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <stat.icon size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">Đơn hàng gần đây</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors duration-200">
              Xem tất cả <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Số tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">Thông báo</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors duration-200">
              Xem tất cả <ChevronRight size={16} />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentNotifications.map((notification, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <AlertCircle size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Popular Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">Sản phẩm phổ biến</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors duration-200">
              Xem tất cả <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Đã bán</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tồn kho</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {popularProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-gray-800">Tổng sản phẩm</h4>
                <p className="text-gray-500 text-sm">Trong hệ thống</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Package size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-3xl font-bold text-gray-800">458</h3>
              <div className="flex items-center mt-2">
                <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full inline-flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  +8% so với tháng trước
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-gray-800">Tổng bài viết</h4>
                <p className="text-gray-500 text-sm">Đã xuất bản</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <FileText size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-3xl font-bold text-gray-800">124</h3>
              <div className="flex items-center mt-2">
                <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full inline-flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  +12% so với tháng trước
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-sm p-6 md:col-span-2">
            <h4 className="font-bold text-white mb-4">Thao tác nhanh</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-lg text-sm font-medium transition-colors duration-200 flex flex-col items-center">
                <ShoppingBag size={20} className="mb-1" />
                Thêm đơn hàng
              </button>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-lg text-sm font-medium transition-colors duration-200 flex flex-col items-center">
                <Package size={20} className="mb-1" />
                Thêm sản phẩm
              </button>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-lg text-sm font-medium transition-colors duration-200 flex flex-col items-center">
                <FileText size={20} className="mb-1" />
                Tạo bài viết
              </button>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-lg text-sm font-medium transition-colors duration-200 flex flex-col items-center">
                <Users size={20} className="mb-1" />
                Thêm người dùng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;