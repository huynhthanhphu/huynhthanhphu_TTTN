import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import CartService from '../../../services/CartService';
import jwtDecode from 'jwt-decode';

const LoginPage = () => {
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({ ...prev, [name]: value }));
        if (loginError) setLoginError('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError('');

        if (!loginForm.username.trim()) {
            setLoginError('Vui lòng nhập tên đăng nhập');
            setIsLoading(false);
            return;
        }
        if (!loginForm.password) {
            setLoginError('Vui lòng nhập mật khẩu');
            setIsLoading(false);
            return;
        }

        try {
            await AuthService.login(loginForm.username, loginForm.password);
            navigate('/'); 
            window.location.reload();
        } catch (error) {
            setLoginError(error.response?.data?.message || 'Đăng nhập không thành công.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-center font-mono">ĐĂNG NHẬP TÀI KHOẢN</h2>
                    <p className="text-center text-gray-300 mt-2 font-mono">Nhập tên đăng nhập và mật khẩu của bạn:</p>
                </div>
                <div className="p-6 md:p-8">
                    {loginError && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-5 rounded-md font-mono">
                            {loginError}
                        </div>
                    )}
                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <input
                            type="text"
                            name="username"
                            placeholder="Tên đăng nhập"
                            value={loginForm.username}
                            onChange={handleLoginChange}
                            className="w-full border px-4 py-3 rounded-lg font-mono"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={loginForm.password}
                            onChange={handleLoginChange}
                            className="w-full border px-4 py-3 rounded-lg font-mono"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-mono"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                        <div className="flex justify-between text-sm mt-2 text-blue-500 cursor-pointer">
                            <span onClick={() => navigate('/quen-mat-khau')}>Quên mật khẩu?</span>
                            <span onClick={() => navigate('/dang-ky-tai-khoan')}>Tạo tài khoản</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
 