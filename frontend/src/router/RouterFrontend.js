import OrderSuccess from "../components/OrderSuccess";
import Cart from "../pages/frontend/Cart";
import Checkout from "../pages/frontend/Checkout";
import Home from "../pages/frontend/home/Home";
import ProductAll from "../pages/frontend/product/ProductAll";
import ProductCategory from "../pages/frontend/product/ProductCategory";
import ProductDetail from "../pages/frontend/product/ProductDetail";
import ProductSearch from "../pages/frontend/product/ProductSearch";
import Register from "../pages/frontend/auth/Register";
import ForgotPassword from "../pages/frontend/auth/ForgotPassword.js" 
import ResetPassword from "../pages/frontend/auth/ResetPassword.js";
import LoginPage from '../pages/frontend/auth/LoginPage';
import AccountInfo from "../pages/frontend/auth/AccountInfo.js";
import  Contact  from "../pages/frontend/Contact.js";


const RouterFrontend = [
    // Trang chủ
    { path: '/', element: <Home /> },
    { path: '/tat-ca-san-pham', element: <ProductAll /> },
    { path: '/danh-muc-san-pham/:categoryId', element: <ProductCategory /> },
    { path: '/tim-kiem-san-pham', element: <ProductSearch /> },
    { path: '/chi-tiet-san-pham/:id', element: <ProductDetail /> },
    { path: '/dang-ky-tai-khoan', element: <Register /> },
    { path: '/dang-nhap', element: <LoginPage />},
    { path: '/tai-khoan/:id', element: <AccountInfo />},
    { path: '/gio-hang', element: <Cart /> },
    { path: "/thanh-toan", element: <Checkout /> },
    { path: "/dat-hang-thanh-cong/:id", element: <OrderSuccess /> },
    { path: "/quen-mat-khau", element: <ForgotPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/lien-he", element: <Contact /> },
];

export default RouterFrontend;