import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaUndo, FaList, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import UserService from '../../../services/UserService';

const UserTrash = () => {
    const navigate = useNavigate();
    const [trashedUsers, setTrashedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        fetchTrashedUsers();
    }, []);

    const fetchTrashedUsers = async () => {
        try {
            setLoading(true);
            const usersData = await UserService.getTrashedUsers();
            setTrashedUsers(usersData);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách người dùng đã xóa. Vui lòng thử lại sau.');
            console.error('Error fetching trashed users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        const confirmRestore = window.confirm("Bạn có chắc chắn muốn khôi phục người dùng này?");
        if (confirmRestore) {
            try {
                await UserService.restoreFromTrash(id);
                fetchTrashedUsers();
                alert('Khôi phục người dùng thành công!');
            } catch (err) {
                alert('Có lỗi xảy ra khi khôi phục. Vui lòng thử lại.');
                console.error('Error restoring user:', err);
            }
        }
    };

    const handleDeletePermanently = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn người dùng này? Hành động này không thể hoàn tác.");
        if (confirmDelete) {
            try {
                await UserService.delete(id);
                fetchTrashedUsers();
                alert('Xóa vĩnh viễn người dùng thành công!');
            } catch (err) {
                alert('Có lỗi xảy ra khi xóa. Vui lòng thử lại.');
                console.error('Error deleting user permanently:', err);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const user = trashedUsers.find(u => u.id === id);
            await UserService.update(id, { ...user, status: !user.status });
            fetchTrashedUsers();
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
            setSelectedItems(trashedUsers.map(user => user.id));
        }
        setSelectAll(!selectAll);
    };

    const handleRestoreSelected = async () => {
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một người dùng');
            return;
        }

        const confirmRestore = window.confirm(`Bạn có chắc chắn muốn khôi phục ${selectedItems.length} người dùng?`);
        if (confirmRestore) {
            try {
                await Promise.all(selectedItems.map(id => UserService.restoreFromTrash(id)));
                fetchTrashedUsers();
                setSelectedItems([]);
                setSelectAll(false);
                alert('Khôi phục người dùng thành công!');
            } catch (err) {
                alert('Có lỗi xảy ra khi khôi phục. Vui lòng thử lại.');
                console.error('Error restoring users:', err);
            }
        }
    };

    const handleDeleteSelectedPermanently = async () => {
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một người dùng');
            return;
        }

        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedItems.length} người dùng? Hành động này không thể hoàn tác.`);
        if (confirmDelete) {
            try {
                await Promise.all(selectedItems.map(id => UserService.delete(id)));
                fetchTrashedUsers();
                setSelectedItems([]);
                setSelectAll(false);
                alert('Xóa vĩnh viễn người dùng thành công!');
            } catch (err) {
                alert('Có lỗi xảy ra khi xóa. Vui lòng thử lại.');
                console.error('Error deleting users permanently:', err);
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
                <h1 className="text-2xl font-bold">Thùng rác - Người dùng</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                    onClick={() => handleNavigate('/admin/user')}
                >
                    <FaList className="mr-2" />
                    Quay lại danh sách
                </button>
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
                            {trashedUsers.length > 0 ? (
                                trashedUsers.map((user) => (
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
                                                    onClick={() => handleRestore(user.id)}
                                                    className="bg-green-500 p-2 text-white rounded"
                                                    title="Khôi phục"
                                                >
                                                    <FaUndo />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePermanently(user.id)}
                                                    className="bg-red-600 p-2 text-white rounded"
                                                    title="Xóa vĩnh viễn"
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
                                        Thùng rác trống
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    {trashedUsers.length > 0 && `Hiển thị ${trashedUsers.length} người dùng trong thùng rác`}
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleSelectAll}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                    >
                        {selectAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </button>
                    <button
                        onClick={handleRestoreSelected}
                        disabled={selectedItems.length === 0}
                        className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        Khôi phục ({selectedItems.length})
                    </button>
                    <button
                        onClick={handleDeleteSelectedPermanently}
                        disabled={selectedItems.length === 0}
                        className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        Xóa vĩnh viễn ({selectedItems.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserTrash;