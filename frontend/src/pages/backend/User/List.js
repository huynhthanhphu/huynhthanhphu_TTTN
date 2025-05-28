import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaToggleOn, FaToggleOff, FaEye, FaEdit, FaTrashAlt, FaUserPlus } from 'react-icons/fa';
import UserService from '../../../services/UserService';

const UserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const usersData = await UserService.getAll();
            setUsers(usersData);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMoveToTrash = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn chuyển người dùng này vào thùng rác?");
        if (confirmDelete) {
            try {
                await UserService.moveToTrash(id);
                fetchUsers();
                alert('Chuyển người dùng vào thùng rác thành công!');
            } catch (err) {
                alert('Có lỗi xảy ra khi chuyển vào thùng rác. Vui lòng thử lại.');
                console.error('Error moving user to trash:', err);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const user = users.find(u => u.id === id);
            await UserService.update(id, { ...user, status: !user.status });
            fetchUsers();
            alert('Cập nhật trạng thái thành công!');
        } catch (err) {
            alert('Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.');
            console.error('Error updating user status:', err);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleSelectItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(users.map(user => user.id));
        }
        setSelectAll(!selectAll);
    };

    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một người dùng');
            return;
        }

        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn chuyển ${selectedItems.length} người dùng vào thùng rác?`);
        if (confirmDelete) {
            try {
                await Promise.all(selectedItems.map(id => UserService.deleteUser(id)));
                fetchUsers();
                setSelectedItems([]);
                setSelectAll(false);
                alert('Chuyển người dùng vào thùng rác thành công!');
            } catch (err) {
                alert('Có lỗi xảy ra khi chuyển vào thùng rác. Vui lòng thử lại.');
                console.error('Error moving users to trash:', err);
            }
        }
    };

    const AuthenticatedImage = ({ src, alt, className }) => {
        const [imageSrc, setImageSrc] = useState(null);

        useEffect(() => {
            const fetchImage = async () => {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(src, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const blob = await response.blob();
                        setImageSrc(URL.createObjectURL(blob));
                    } else {
                        setImageSrc('/placeholder-image.jpg');
                    }
                } catch (error) {
                    console.error('Error loading image:', error);
                    setImageSrc('/placeholder-image.jpg');
                }
            };

            fetchImage();

            return () => {
                if (imageSrc && imageSrc.startsWith('blob:')) {
                    URL.revokeObjectURL(imageSrc);
                }
            };
        }, [src]);

        return <img src={imageSrc || '/loading-placeholder.jpg'} alt={alt} className={className} />;
    };


    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <div className="container mx-auto mt-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Danh sách Người dùng</h1>
                <div className="flex space-x-3">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
                        onClick={() => handleNavigate('/admin/user/create')}
                    >
                        <FaUserPlus className="mr-2" />
                        Thêm mới
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
                        onClick={() => handleNavigate('/admin/user/trash')}
                    >
                        <FaTrashAlt className="mr-2" />
                        Thùng rác
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 text-blue-600 rounded"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(user.id)}
                                                onChange={() => handleSelectItem(user.id)}
                                                className="h-4 w-4 text-blue-600 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.image ? (
                                                <AuthenticatedImage
                                                    src={`http://localhost:8080/uploads/users/${user.image}`}
                                                    alt={user.fullName}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500 text-xs">No img</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.fullName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs ${user.status
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.status ? 'Hoạt động' : 'Vô hiệu hóa'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleToggleStatus(user.id)}
                                                    className={`p-2 rounded ${user.status ? 'bg-green-500' : 'bg-gray-400'
                                                        } text-white`}
                                                    title={user.status ? "Vô hiệu hóa" : "Kích hoạt"}
                                                >
                                                    {user.status ? <FaToggleOn /> : <FaToggleOff />}
                                                </button>
                                                <button
                                                    onClick={() => handleNavigate(`/admin/user/detail/${user.id}`)}
                                                    className="bg-blue-500 p-2 text-white rounded"
                                                    title="Xem chi tiết"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => handleNavigate(`/admin/user/update/${user.id}`)}
                                                    className="bg-yellow-500 p-2 text-white rounded"
                                                    title="Chỉnh sửa"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleMoveToTrash(user.id)}
                                                    className="bg-red-500 p-2 text-white rounded"
                                                    title="Xóa"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                        Không có người dùng nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    {users.length > 0 && `Hiển thị ${users.length} người dùng`}
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleSelectAll}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                    >
                        {selectAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </button>
                    <button
                        onClick={handleDeleteSelected}
                        disabled={selectedItems.length === 0}
                        className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        Xóa ({selectedItems.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserList;