import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductGridNew from "./ProductGridNew";
import { useEffect, useState } from "react";
import ProductService from "../services/ProductService";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const ProductNew = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const productsPerPage = 4;

  useEffect(() => {
    fetchNewProducts();
  }, []);

  const fetchNewProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getAll();
      const productsData = Array.isArray(response)
        ? response
        : response.data || [];

      const activeProducts = productsData
        .filter((product) => product.status === true || product.status === 1)
        .sort((a, b) => {
          if (a.created_at && b.created_at) {
            return new Date(b.created_at) - new Date(a.created_at);
          }
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return b.id - a.id;
        });

      setProducts(activeProducts);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm mới. Vui lòng thử lại sau.");
      console.error("Error fetching new products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder-image.jpg";
    return `http://localhost:8080/uploads/products/${imagePath}`;
  };

  const totalPages = Math.ceil(products.length / productsPerPage);

  const nextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const prevProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  let displayedProducts = products.slice(
    currentIndex * productsPerPage,
    currentIndex * productsPerPage + productsPerPage
  );

  if (displayedProducts.length < productsPerPage && products.length > 0) {
    const missingItems = productsPerPage - displayedProducts.length;
    displayedProducts = [
      ...displayedProducts,
      ...products.slice(0, missingItems),
    ];
  }

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 relative">
      <h1 className="text-3xl font-mono text-gray-900 mt-20 mb-12 text-center"style={{ fontFamily: 'Dancing Script' }}>
        SẢN PHẨM MỚI
      </h1>

      {loading ? (
        <div className="text-center py-10">
          <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-10 h-10 animate-spin mx-auto" />
          <p className="mt-2 text-gray-500">Đang tải sản phẩm mới...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
          <p>{error}</p>
        </div>
      ) : displayedProducts.length > 0 ? (
        <>
          <div className="flex items-center justify-between gap-4">
            {/* Nút trái */}
            <button
              onClick={prevProduct}
              className="bg-white border shadow-md rounded-full p-2 hover:bg-gray-100 z-10"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
            </button>

            {/* Lưới sản phẩm */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/chi-tiet-san-pham/${product.slug || product.id}`)
                  }
                >
                  <ProductCard
                    image={getImageUrl(product.image)}
                    name={product.name}
                    description={product.description || "Không có mô tả"}
                    price={parseFloat(product.price)}
                    discountPrice={
                      product.is_on_sale === 1 || product.priceSale > 0
                        ? parseFloat(product.price_sale || product.priceSale)
                        : null
                    }
                    rating={product.rating || 5}
                    reviews={product.reviewCount || 0}
                  />
                </div>
              ))}
            </div>

            {/* Nút phải */}
            <button
              onClick={nextProduct}
              className="bg-white border shadow-md rounded-full p-2 hover:bg-gray-100 z-10"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-6">
          Không có sản phẩm mới nào.
        </div>
      )}
      <ProductGridNew />
    </div>
  );
};

export default ProductNew;
