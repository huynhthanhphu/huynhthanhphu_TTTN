import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CategoryService from '../services/CategoryService';

const MainMenu = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const [activeParentCategory, setActiveParentCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await CategoryService.index();
            const categoriesData = Array.isArray(response) ? response :
                (response.data ? response.data : []);
            const parentCategories = categoriesData.filter(cat =>
                !cat.parent_id || cat.parent_id === 'NULL' || cat.parent_id === null
            );
            parentCategories.forEach(parent => {
                parent.children = categoriesData.filter(child =>
                    child.parent_id &&
                    child.parent_id !== 'NULL' &&
                    child.parent_id !== null &&
                    parseInt(child.parent_id) === parseInt(parent.id)
                );
            });
            const activeParentCategories = parentCategories.filter(cat => cat.status === true);
            setCategories(activeParentCategories);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách danh mục.');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId) => {
        setActiveParentCategory(prev =>
            prev === categoryId ? null : categoryId
        );
    };

    return (
        <nav className="hidden lg:flex flex-1 items-center justify-center space-x-8 text-sm font-medium">
            <Link to="/" className={`relative py-2 hover:text-red-600 transition-colors duration-200 ${currentPath === '/' ? 'text-red-600 font-semibold' : ''}`}>
                TRANG CHỦ
                {currentPath === '/' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>}
            </Link>

            <Link to="/tat-ca-san-pham" className={`relative py-2 hover:text-red-600 transition-colors duration-200 ${currentPath.includes('/tat-ca-san-pham') ? 'text-red-600 font-semibold' : ''}`}>
                TẤT CẢ SẢN PHẨM
                {currentPath.includes('/tat-ca-san-pham') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>}
            </Link>

            {/* Shop Dropdown */}
            <div className="relative" id="categories-dropdown">
                <button
                    className={`relative py-2 hover:text-red-600 transition-colors duration-200 flex items-center ${currentPath.includes('/shop') ? 'text-red-600 font-semibold' : ''}`}
                    onClick={() => setShowCategories(!showCategories)}
                >
                    SHOP
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {currentPath.includes('/shop') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>}
                </button>

                {/* Dropdown content */}
                {loading ? (
                    showCategories && (
                        <div className="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg z-30 py-4 text-center animate-fadeIn">
                            <div className="flex justify-center items-center">
                                <svg className="animate-spin h-5 w-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-gray-500 text-sm">Đang tải danh mục...</p>
                            </div>
                        </div>
                    )
                ) : error ? (
                    showCategories && (
                        <div className="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg z-30 py-4 text-center animate-fadeIn">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )
                ) : (
                    categories.length > 0 && showCategories && (
                        <div className="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg z-30 animate-fadeIn overflow-hidden">
                            <ul className="py-1">
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        {category.children && category.children.length > 0 ? (
                                            <>
                                                <button
                                                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${activeParentCategory === category.id ? 'bg-gray-50 font-medium' : ''} flex items-center justify-between`}
                                                    onClick={() => handleCategoryClick(category.id)}
                                                >
                                                    <span>{category.name}</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className={`h-4 w-4 transition-transform duration-200 ${activeParentCategory === category.id ? 'rotate-180' : ''}`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                                {activeParentCategory === category.id && (
                                                    <div className="bg-gray-50 py-1">
                                                        {category.children.filter(child => child.status === true).map(child => (
                                                            <Link
                                                                key={child.id}
                                                                to={`/danh-muc-san-pham/${child.id}`}
                                                                className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                                            >
                                                                • {child.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <Link
                                                to={`/danh-muc-san-pham/${category.id}`}
                                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                {category.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                )}
            </div>

            <Link to="/lien-he" className={`relative py-2 hover:text-red-600 transition-colors duration-200 ${currentPath === '/lien-he' ? 'text-red-600 font-semibold' : ''}`}>
                LIÊN HỆ
                {currentPath === '/lien-he' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>}
            </Link>

            <Link to="/gioi-thieu" className={`relative py-2 hover:text-red-600 transition-colors duration-200 ${currentPath === '/gioi-thieu' ? 'text-red-600 font-semibold' : ''}`}>
                GIỚI THIỆU
                {currentPath === '/gioi-thieu' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>}
            </Link>
        </nav>
    );
};

export default MainMenu;
