import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUndo, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import BrandService from '../../../services/BrandService';

const BrandTrashList = () => {
  const navigate = useNavigate();
  const [trash, setTrash] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const response = await BrandService.getTrash();
      const trashData = Array.isArray(response) ? response : (response.data ? response.data : []);
      setTrash(trashData);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách thương hiệu trong thùng rác. Vui lòng thử lại sau.');
      console.error('Error fetching trash:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    const confirmRestore = window.confirm("Bạn có chắc chắn muốn khôi phục thương hiệu này?");
    if (confirmRestore) {
      try {
        await BrandService.restoreFromTrash(id);
        fetchTrash();
        alert('Khôi phục thương hiệu thành công!');
      } catch (err) {
        alert('Có lỗi xảy ra khi khôi phục. Vui lòng thử lại.');
        console.error('Error restoring brand:', err);
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn thương hiệu này?");
    if (confirmDelete) {
      try {
        await BrandService.delete(id);
        fetchTrash();
        alert('Xóa thương hiệu thành công!');
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa. Vui lòng thử lại.');
        console.error('Error deleting brand:', err);
      }
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(trash.map(brand => brand.id));
    }
    setSelectAll(!selectAll);
  };

  const handleRestoreSelected = async () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một thương hiệu');
      return;
    }

    const confirmRestore = window.confirm(`Bạn có chắc chắn muốn khôi phục ${selectedItems.length} thương hiệu?`);
    if (confirmRestore) {
      try {
        await Promise.all(selectedItems.map(id => BrandService.restoreFromTrash(id)));
        fetchTrash();
        setSelectedItems([]);
        setSelectAll(false);
        alert('Khôi phục thương hiệu thành công!');
      } catch (err) {
        alert('Có lỗi xảy ra khi khôi phục. Vui lòng thử lại.');
        console.error('Error restoring brands:', err);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một thương hiệu');
      return;
    }

    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedItems.length} thương hiệu?`);
    if (confirmDelete) {
      try {
        await Promise.all(selectedItems.map(id => BrandService.delete(id)));
        fetchTrash();
        setSelectedItems([]);
        setSelectAll(false);
        alert('Xóa thương hiệu thành công!');
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa. Vui lòng thử lại.');
        console.error('Error deleting brands:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto mt-8 px-4 text-center font-mono">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-500 rounded-full animate-pulse delay-150"></div>
          <div className="w-4 h-4 bg-gray-500 rounded-full animate-pulse delay-300"></div>
        </div>
        <p className="text-gray-600 mt-2">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 px-4 font-mono">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-gray-700">
          <span className="border-b-2 border-blue-500 pb-1">Thương hiệu trong thùng rác</span>
        </h1>
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded inline-flex items-center text-sm shadow-sm transition duration-150"
          onClick={() => navigate('/admin/brand')}
        >
          <FaArrowLeft className="mr-2" />
          Quay lại
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên thương hiệu</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {trash && trash.length > 0 ? (
                trash.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={selectedItems.includes(brand.id)}
                        onChange={() => handleSelectItem(brand.id)}
                      />
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-500">{brand.id}</td>
                    <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800">{brand.name}</td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-500">
                      {brand.description ? (
                        brand.description.length > 30
                          ? `${brand.description.substring(0, 30)}...`
                          : brand.description
                      ) : 'N/A'}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <button
                          className="bg-green-500 p-1.5 text-white rounded hover:opacity-80 transition-opacity"
                          onClick={() => handleRestore(brand.id)}
                          title="Khôi phục"
                        >
                          <FaUndo />
                        </button>
                        <button
                          className="bg-red-500 p-1.5 text-white rounded hover:opacity-80 transition-opacity"
                          onClick={() => handleDelete(brand.id)}
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
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    Không có thương hiệu nào trong thùng rác.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {trash.length > 0 && (
        <div className="mt-4 flex justify-between">
          <div className="text-sm text-gray-600">
            Đã chọn: <strong>{selectedItems.length}</strong> / {trash.length}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRestoreSelected}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm shadow"
            >
              <FaUndo className="inline mr-1" />
              Khôi phục đã chọn
            </button>
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm shadow"
            >
              <FaTrashAlt className="inline mr-1" />
              Xóa vĩnh viễn đã chọn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandTrashList;
