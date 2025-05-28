import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import BrandService from '../../../services/BrandService';

const BrandUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBrandDetails();
    }, [id]);

    const fetchBrandDetails = async () => {
        try {
            const response = await BrandService.detail(id);
            const brandData = response?.data?.data || response?.data || response;
            setName(brandData.name || '');
            setDescription(brandData.description || '');
            setStatus(brandData.status === 1 || brandData.status === true || brandData.status === 'true');
        } catch (err) {
            setError('Không thể lấy thông tin thương hiệu.');
            console.error('Error fetching brand:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = {
                name,
                description,
                status: status === true || status === 'true' ? 1 : 0,
            };
            await BrandService.update(id, data);
            alert('Cập nhật thương hiệu thành công!');
            navigate('/admin/brand');
        } catch (err) {
            setError('Lỗi khi cập nhật thương hiệu. Vui lòng thử lại.');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-10 font-mono">
                <div className="flex justify-center space-x-2">
                    <div className="w-4 h-4 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    <div className="w-4 h-4 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                </div>
                <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 mt-8 font-mono">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium text-gray-700">
                    <span className="border-b-2 border-blue-500 pb-1">Cập nhật Thương hiệu</span>
                </h1>
                <button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded inline-flex items-center text-sm"
                    onClick={() => navigate('/admin/brand')}
                >
                    <FaArrowLeft className="mr-2" />
                    Quay lại
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên thương hiệu</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                                placeholder="Nhập tên thương hiệu"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                            <select
                                value={status.toString()}
                                onChange={(e) => setStatus(e.target.value === 'true')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                            >
                                <option value="true">Hiển thị</option>
                                <option value="false">Ẩn</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                            <textarea
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                                placeholder="Nhập mô tả thương hiệu"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/brand')}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded inline-flex items-center"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded inline-flex items-center"
                        >
                            <FaSave className="mr-2" />
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BrandUpdate;
