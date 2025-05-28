import React from 'react';

const PolicySection = () => {
  const policies = [
    {
      icon: "./images/policies/ser_1.webp",
      title: "Miễn phí giao hàng",
      description: "Miễn phí ship với đơn hàng > 399K"
    },
    {
      icon: "./images/policies/ser_2.webp",
      title: "Thanh toán COD",
      description: "Thanh toán khi nhận hàng(COD)"
    },
    {
      icon: "./images/policies/ser_3.webp",
      title: "Khách hàng VIP",
      description: "Ưu đãi dành cho khách hàng VIP"
    },
    {
      icon: "./images/policies/ser_4.webp",
      title: "Hỗ trợ bảo hành",
      description: "Đổi, sửa đồ khi lỗi"
    }
  ];

  return (
    
    <div className="mx-auto px-4 py-2 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {policies.map((policy, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={policy.icon} 
                alt={policy.title} 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg-2">{policy.title}</h3>
              <p className="text-sm text-gray-600 md:block hidden">{policy.description}</p>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicySection;