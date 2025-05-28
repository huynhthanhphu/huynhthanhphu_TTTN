import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import { EyeIcon, EyeOffIcon, ArrowLeftIcon, User, Mail, CalendarIcon, Lock } from 'lucide-react';

const Register = () => { 
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        birthDate: '',
        gender: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Clear errors for this field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleGenderChange = (value) => {
        setFormData({
            ...formData,
            gender: value
        });

        // Clear error for gender field
        if (errors.gender) {
            setErrors({
                ...errors,
                gender: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Vui lòng nhập tên người dùng';
        } else {
            // Kiểm tra định dạng username (không chứa ký tự đặc biệt và khoảng trắng)
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            if (!usernameRegex.test(formData.username)) {
                newErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
            }
        }

        if (!formData.fullname.trim()) {
            newErrors.fullname = 'Vui lòng nhập họ và tên';
        }

        if (!formData.birthDate) {
            newErrors.birthDate = 'Vui lòng nhập ngày sinh';
        } else {
            // Validate date format (MM/DD/YYYY)
            const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
            if (!dateRegex.test(formData.birthDate)) {
                newErrors.birthDate = 'Ngày sinh không hợp lệ (định dạng MM/DD/YYYY)';
            } else {
                // Check if it's a valid date
                const parts = formData.birthDate.split('/');
                const date = new Date(parts[2], parts[0] - 1, parts[1]);
                const isValidDate = date.getMonth() === parseInt(parts[0]) - 1 &&
                    date.getDate() === parseInt(parts[1]) &&
                    date.getFullYear() === parseInt(parts[2]);

                if (!isValidDate) {
                    newErrors.birthDate = 'Ngày sinh không hợp lệ';
                }
            }
        }

        if (!formData.gender) {
            newErrors.gender = 'Vui lòng chọn giới tính';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset messages
        setServerError('');
        setSuccessMessage('');

        // Validate form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Format the data for the backend
        const userData = {
            username: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password,
            fullName: formData.fullname.trim(),
            birthDate: formatDateForBackend(formData.birthDate),
            gender: formData.gender,
            role: 'user',
            status: 1,
        };

        try {
            setIsLoading(true);

            // Sử dụng AuthService để đăng ký
            const response = await AuthService.register(userData);

            setSuccessMessage('Đăng ký thành công! Bạn sẽ được chuyển đến trang chủ...');

            // Redirect after successful registration
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            setServerError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Format date from MM/DD/YYYY to YYYY-MM-DD for backend
    const formatDateForBackend = (dateString) => {
        if (!dateString) return null;

        const parts = dateString.split('/');
        if (parts.length !== 3) return null;

        // Convert MM/DD/YYYY to YYYY-MM-DD
        return `${parts[2]}-${parts[0]}-${parts[1]}`;
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left Column - Image and Text */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-12 text-white flex flex-col justify-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-500 rounded-full opacity-20 transform translate-x-1/4 translate-y-1/4"></div>
                        
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 relative z-10">Chào mừng bạn</h2>
                        <p className="text-lg opacity-90 mb-8 relative z-10">
                            Tạo tài khoản để khám phá trải nghiệm tuyệt vời và đầy đủ các dịch vụ của chúng tôi.
                        </p>
                        
                        {/* Feature list */}
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Trải nghiệm được cá nhân hóa</span>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Cập nhật thông tin mới nhất</span>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Bảo mật dữ liệu tối đa</span>
                            </div>
                        </div>
                        
                        {/* Success message */}
                        {successMessage && (
                            <div className="mt-8 bg-green-500/30 border border-green-300 rounded-lg px-4 py-3 relative z-10" role="alert">
                                <p className="font-medium">{successMessage}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Form */}
                    <div className="p-8 lg:p-12">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Tạo tài khoản</h2>
                            <p className="text-gray-600">Điền thông tin bên dưới để đăng ký</p>
                        </div>

                        {/* Server error message */}
                        {serverError && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
                                <p>{serverError}</p>
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Tên người dùng</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Nhập tên người dùng"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`pl-10 w-full px-4 py-2.5 bg-gray-50 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                                    />
                                </div>
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                            </div>

                            <div>
                                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="fullname"
                                        name="fullname"
                                        type="text"
                                        placeholder="Nhập họ và tên đầy đủ"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        className={`pl-10 w-full px-4 py-2.5 bg-gray-50 border ${errors.fullname ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                                    />
                                </div>
                                {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="birthDate"
                                            name="birthDate"
                                            type="text"
                                            placeholder="mm/dd/yyyy"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                            className={`pl-10 w-full px-4 py-2.5 bg-gray-50 border ${errors.birthDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                                        />
                                    </div>
                                    {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                    <div className="flex items-center space-x-6 mt-1">
                                        <label className="flex items-center">
                                            <input
                                                id="gender-female"
                                                name="gender"
                                                type="radio"
                                                checked={formData.gender === "female"}
                                                onChange={() => handleGenderChange("female")}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-gray-700">Nữ</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                id="gender-male"
                                                name="gender"
                                                type="radio"
                                                checked={formData.gender === "male"}
                                                onChange={() => handleGenderChange("male")}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-gray-700">Nam</span>
                                        </label>
                                    </div>
                                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`pl-10 w-full px-4 py-2.5 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`pl-10 w-full px-4 py-2.5 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`pl-10 w-full px-4 py-2.5 bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <div className="text-gray-500 text-xs">
                                Trang web này được bảo vệ bởi reCAPTCHA và tuân theo <a href="#" className="text-indigo-600 hover:text-indigo-800">Chính sách Bảo mật</a> và <a href="#" className="text-indigo-600 hover:text-indigo-800">Điều khoản Dịch vụ</a> của Google.
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            ĐANG XỬ LÝ...
                                        </>
                                    ) : 'ĐĂNG KÝ'}
                                </button>
                            </div>

                            <div className="mt-4 text-center">
                                <span className="text-gray-600">Đã có tài khoản? </span>
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Đăng nhập</a>
                            </div>

                            <button
                                type="button"
                                onClick={handleBack}
                                className="mt-4 flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200 mx-auto"
                            >
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Quay lại trang chủ
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;