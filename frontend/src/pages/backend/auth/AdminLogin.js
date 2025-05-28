import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import UserService from '../../../services/UserService';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const navigate = useNavigate();

    // Check if already logged in
    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            navigate('/admin');
        }
    }, [navigate]);

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!credentials.username) {
            tempErrors.username = 'Tên đăng nhập không được để trống';
            isValid = false;
        }

        if (!credentials.password) {
            tempErrors.password = 'Mật khẩu không được để trống';
            isValid = false;
        } else if (credentials.password.length < 6) {
            tempErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
        // Clear login error
        if (loginError) {
            setLoginError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);
            setLoginError('');

            try {
                const response = await UserService.adminLogin(credentials.username, credentials.password);

                if (response && response.token) {
                    setLoginSuccess('Đăng nhập thành công! Đang chuyển hướng...');

                    // Save token and user info
                    localStorage.setItem('admin_token', response.token);

                    const userData = {
                        id: response.user.id,
                        username: response.user.username,
                        email: response.user.email,
                        fullname: response.user.fullname || response.user.name || 'Admin User',
                        role: response.user.role || 'admin'
                    };

                    localStorage.setItem('user', JSON.stringify(userData));

                    setTimeout(() => {
                        navigate('/admin');
                    }, 1500);
                } else {
                    setLoginError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
                }
            } catch (error) {
                console.error('Login error:', error);
                const errorMessage = error.message || 'Đăng nhập thất bại. Vui lòng thử lại sau.';
                setLoginError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-8 px-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-white font-mono tracking-tight">Admin Portal</h2>
                        <p className="mt-2 text-blue-100 font-sans">Đăng nhập để truy cập hệ thống quản trị</p>
                    </div>
                </div>

                <div className="px-8 py-8">
                    {loginError && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start animate-fade-in">
                            <AlertCircle size={22} className="mr-3 mt-0.5 flex-shrink-0 text-red-500" />
                            <p className="text-sm">{loginError}</p>
                        </div>
                    )}

                    {loginSuccess && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-start animate-pulse">
                            <CheckCircle size={22} className="mr-3 mt-0.5 flex-shrink-0 text-green-500" />
                            <p className="text-sm">{loginSuccess}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
                                Tên đăng nhập
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    value={credentials.username}
                                    onChange={handleChange}
                                    className={`pl-10 block w-full border ${errors.username ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </div>
                            {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    className={`pl-10 block w-full border ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                                    placeholder="Nhập mật khẩu"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember_me"
                                    name="remember_me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                                    Quên mật khẩu?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || loginSuccess}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </>
                                ) : loginSuccess ? 'Đã đăng nhập' : 'Đăng nhập'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                    <p className="text-center text-sm text-gray-600">
                        © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;