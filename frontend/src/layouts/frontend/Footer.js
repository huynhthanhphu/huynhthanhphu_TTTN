import React, { useState } from 'react';
import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone, Clock } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  
  const handleSubscribe = () => {
    console.log('Subscribed with email:', email);
    setEmail('');
    // Xử lý logic đăng ký nhận tin tức
  };
  
  return (
    <footer className="bg-gray-50 py-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Main Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Section */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">OUTERITY</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Thương hiệu thời trang đường phố với sứ mệnh tạo ra những sản phẩm chất lượng cao, 
              thiết kế độc đáo và giá cả hợp lý cho giới trẻ Việt Nam.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-sky-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-600 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h2 className="text-lg font-semibold mb-6 text-gray-800 uppercase tracking-wide">Chính sách</h2>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-black text-sm hover:underline transition-all">Tìm kiếm</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm hover:underline transition-all">Giới thiệu</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm hover:underline transition-all">Chính sách thanh toán</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm hover:underline transition-all">Chính sách vận chuyển</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm hover:underline transition-all">Chính sách đổi trả</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm hover:underline transition-all">Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div>
            <h2 className="text-lg font-semibold mb-6 text-gray-800 uppercase tracking-wide">Thông tin liên hệ</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-600 text-sm">22 Nguyễn Thái Học, P. Tân Thành, Q. Tân Phú, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                <span className="text-gray-600 text-sm">086 2642568</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                <span className="text-gray-600 text-sm">10:00 - 21:30 (Thứ 2 - Chủ Nhật)</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                <span className="text-gray-600 text-sm">outerity.local@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h2 className="text-lg font-semibold mb-6 text-gray-800 uppercase tracking-wide">Đăng ký nhận tin</h2>
            <p className="text-gray-600 mb-4 text-sm">Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt</p>
            <div className="mb-4">
              <div className="flex">
                <input 
                  type="email" 
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email của bạn" 
                  className="bg-white border border-gray-300 text-sm px-4 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <button 
                  onClick={handleSubscribe}
                  className="bg-black text-white text-sm px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  Đăng ký
                </button>
              </div>
            </div>
            
            {/* Payment methods */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-gray-700">Phương thức thanh toán</h3>
              <div className="flex flex-wrap gap-2">
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            © 2025 Outerity. Tất cả quyền được bảo lưu.
          </div>
          <div className="text-sm text-gray-500">
            Thiết kế bởi <span className="font-medium">Outerity</span> | Powered by <span className="font-medium">Haravan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;