import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage('');

        if (!formData.name || !formData.email || !formData.message) {
            setError('Vui lòng điền đầy đủ thông tin.');
            setLoading(false);
            return;
        }

        try {
            setTimeout(() => {
                setSuccessMessage('Cảm ơn bạn! Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.');
                setLoading(false);
                navigate('/thank-you');
            }, 2000);
        } catch (err) {
            console.error('Lỗi gửi form:', err);
            setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
                    Liên Hệ Với Chúng Tôi
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Hãy để lại thông tin của bạn, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Form Section */}
                <div className="">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Họ và Tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full h-12 px-4 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full h-12 px-4 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Số Điện Thoại
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full h-12 px-4 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                Tin Nhắn <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-50 text-green-500 p-4 rounded-lg text-sm">
                                {successMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Đang gửi...
                                </span>
                            ) : (
                                'Gửi Liên Hệ'
                            )}
                        </button>
                    </form>
                </div>

                {/* Contact Info & Map Section */}
                <div className="space-y-8">
                    {/* Contact Information */}
                    <div className="">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Thông Tin Liên Hệ</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <h4 className="font-medium text-gray-800">Địa chỉ</h4>
                                    <p className="text-gray-600">Hồ Chí Minh</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div>
                                    <h4 className="font-medium text-gray-800">Điện thoại</h4>
                                    <p className="text-gray-600">0332112740</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <h4 className="font-medium text-gray-800">Email</h4>
                                    <p className="text-gray-600">huynhthanhphucb2019@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Vị Trí Của Chúng Tôi</h3>
                        <div className="w-full h-[300px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.8948449080767!2d106.76633397480568!3d10.827110589324747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175265513bee543%3A0xa62e9ef626311c68!2zMiBUxINuZyBOaMahbiBQaMO6LCBQaMaw4bubYyBMb25nIEIsIFRo4bunIMSQ4bupYywgSOG7kyBDaMOtIE1pbmggNzAwMDAwLCBWaeG7h3QgTmFt!5e1!3m2!1svi!2s!4v1746927446399!5m2!1svi!2s"
                                className="w-full h-full"
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

