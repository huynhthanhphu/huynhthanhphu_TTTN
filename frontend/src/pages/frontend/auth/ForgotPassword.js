import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../../services/UserService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 5000);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await UserService.forgotPassword({ email });
      showAlert('Mã xác thực đã được gửi đến email của bạn.', 'success');
      localStorage.setItem('resetEmail', email);
      setTimeout(() => navigate('/reset-password'), 1500);
    } catch (err) {
      console.error('ForgotPassword error:', err);
      const msg = err.response?.data?.message || err.message || 'Gửi email thất bại';
      showAlert(msg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-center text-2xl font-semibold mb-4">Quên mật khẩu</h2>
        {alert.message && (
          <div
            className={`alert mb-4 p-3 rounded ${
              alert.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {alert.message}
          </div>
        )}
        <form id="forgotPasswordForm" onSubmit={handleSendCode}>
          <input
            type="email"
            id="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded mb-2 hover:bg-blue-700 transition-colors"
          >
            Gửi mã xác thực
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors"
          >
            Quay lại
          </button>
        </form>
      </div>
    </div>
  );
}
export default ForgotPassword;