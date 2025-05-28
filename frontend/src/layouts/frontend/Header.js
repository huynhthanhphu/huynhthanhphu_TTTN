import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import CartService from '../../services/CartService';
import { jwtDecode } from "jwt-decode";
import MainMenu from '../../../src/components/MainMenu';

const Header = () => {
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: '',
    });
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const navigate = useNavigate();

    // Check login status on component mount
    useEffect(() => {
        checkLoginStatus();
    }, []);

    // Set up cart update event listener and initial fetch
    useEffect(() => {
        window.addEventListener('cart-updated', fetchCartCount);
        fetchCartCount();
        
        return () => {
            window.removeEventListener('cart-updated', fetchCartCount);
        };
    }, [isLoggedIn]);

    // Extract user ID from JWT token
    let userId = null;
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userId = decoded.id || decoded.sub || decoded.userId;
        } catch (err) {
            console.error("Token không hợp lệ");
        }
    }
    
    // Fetch cart item count
    const fetchCartCount = async () => {
        try {
            if (AuthService.isAuthenticated()) {
                const user = AuthService.getCurrentUser();
                if (user && user.id) {
                    const response = await CartService.getCartItemCount(user.id);
                    const count = response?.data?.count || 0;
                    setCartItemCount(count);
                } else {
                    setCartItemCount(0);
                }
            } else {
                setCartItemCount(0);
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
            setCartItemCount(0);
        }
    };

    // Handle search form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/tim-kiem-san-pham?keyword=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    // Check if user is already logged in
    const checkLoginStatus = () => {
        if (AuthService.isAuthenticated()) {
            setIsLoggedIn(true);
            setCurrentUser(AuthService.getCurrentUser());
        }
    };

    // Handle login form changes
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({
            ...prev,
            [name]: value
        }));

        if (loginError) {
            setLoginError('');
        }
    };

    // Handle login form submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError('');

        try {
            // Input validation
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

            // Call login service
            await AuthService.login(loginForm.username, loginForm.password);

            // Update local state
            setIsLoggedIn(true);
            setCurrentUser(AuthService.getCurrentUser());
            
            // Fetch cart count after login
            await fetchCartCount();

            // Reset form and show notification
            setLoginForm({ username: '', password: '' });
            setShowLoginModal(false);
            setShowSuccessNotification(true);

            // Hide notification after 5 seconds
            setTimeout(() => {
                setShowSuccessNotification(false);
            }, 5000);

        } catch (error) {
            console.error('Login error:', error);
            setLoginError(error.response?.data?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        AuthService.logout();
        setIsLoggedIn(false);
        setCurrentUser(null);
        setShowUserDropdown(false);
        setCartItemCount(0);
    };

    // Check if user is admin
    const isAdmin = () => {
        return currentUser && (currentUser.role === 'ADMIN');
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const userDropdown = document.getElementById('user-dropdown');
            const loginModal = document.getElementById('login-modal');
            
            if (userDropdown && !userDropdown.contains(event.target) && !event.target.closest('#user-button')) {
                setShowUserDropdown(false);
            }
            
            if (loginModal && !loginModal.contains(event.target) && event.target.id !== 'login-button') {
                setShowLoginModal(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Set up axios interceptors for authentication
    useEffect(() => {
        AuthService.setupAxiosInterceptors();
    }, []);

    return (
        <div className="font-sans">
            {/* Success Notification */}
            {showSuccessNotification && (
                <div className="fixed top-4 right-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 z-50 shadow-lg rounded-md max-w-md animate__animated animate__fadeIn">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="font-medium">Đăng nhập thành công!</p>
                                <p className="text-sm mt-1">Xin chào, {currentUser?.fullName || currentUser?.username}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowSuccessNotification(false)}
                            className="text-emerald-700 hover:text-emerald-900 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Top Info Bar */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-2">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between items-center">
                        {/* Store Information */}
                        <div className="flex flex-wrap items-center space-x-6">
                            <div className="flex items-center text-sm group">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400 mr-2 group-hover:text-red-300 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div>
                                    <span className="font-medium">Hotline: </span>
                                    <span className="hover:text-red-300 transition-all">086 2642568</span>
                                </div>
                            </div>
                            <div className="flex items-center text-sm group">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400 mr-2 group-hover:text-red-300 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                                <span>Miễn phí giao hàng từ 5 sản phẩm</span>
                            </div>
                            <div className="flex items-center text-sm group">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400 mr-2 group-hover:text-red-300 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                                </svg>
                                <span>1 Đổi 1 nếu lỗi hàng trong 7 ngày</span>
                            </div>
                        </div>

                        {/* User Authentication Area */}
                        <div className="relative" id="user-dropdown">
                            {isLoggedIn ? (
                                <>
                                    {/* Logged-in User Display */}
                                    <button
                                        id="user-button"
                                        className="flex items-center text-sm hover:text-gray-300 transition-all"
                                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                        </svg>
                                        <div className="text-left">
                                            <span>Xin chào, </span>
                                            <span className="font-medium">{currentUser?.fullName || currentUser?.username}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>
                                    
                                    {/* User Dropdown Menu */}
                                    {showUserDropdown && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 overflow-hidden animate__animated animate__fadeIn animate__faster">
                                            <div className="py-3 px-4 bg-gray-50 border-b border-gray-100">
                                                <p className="text-sm text-gray-600">Đã đăng nhập với</p>
                                                <p className="font-medium text-gray-800 truncate">{currentUser?.fullName || currentUser?.username}</p>
                                            </div>
                                            <ul className="py-1">
                                                {isAdmin() && (
                                                    <li>
                                                        <a href="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                                            </svg>
                                                            Quản trị hệ thống
                                                        </a>
                                                    </li>
                                                )}
                                                <li>
                                                    <a href={`/tai-khoan/${userId}`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                        Thông tin tài khoản
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/don-hang" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                                        </svg>
                                                        Đơn hàng của tôi
                                                    </a>
                                                </li>
                                                <li className="border-t border-gray-100">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                                        </svg>
                                                        Đăng xuất
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Login/Register Links
                                <div className="flex items-center text-sm space-x-6">
                                    <Link
                                        to="/dang-nhap"
                                        className="flex items-center hover:text-gray-300 transition-all group"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-400 group-hover:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        <span>Đăng nhập</span>
                                    </Link>

                                    <Link
                                        to="/dang-ky-tai-khoan"
                                        className="flex items-center hover:text-gray-300 transition-all group"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-400 group-hover:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                        </svg>
                                        <span>Đăng ký</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="bg-white sticky top-0 z-20 shadow-md">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        {/* Logo */}
                        <a href="/" className="flex-shrink-0 mr-8 hover:opacity-80 transition-all duration-200">
                            <img
                                src="/logo.png" 
                                alt="Outerity Logo"
                                className="h-10"
                            />
                        </a>
                        
                        {/* Main Navigation Menu */}
                        <MainMenu />
                        
                        {/* Search and Cart */}
                        <div className="flex items-center space-x-6">
                            {/* Search Form */}
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="border border-gray-300 rounded-full px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-200 font-mono transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-all"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </button>
                            </form>
                            
                            {/* Shopping Cart */}
                            <a href="/gio-hang" className="flex items-center hover:opacity-80 transition-all group">
                                <div className="relative">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-800 group-hover:text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-mono">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </div>
                                <span className="ml-2 text-sm font-medium">Giỏ hàng</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;