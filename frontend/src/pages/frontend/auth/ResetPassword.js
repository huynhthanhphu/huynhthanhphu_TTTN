import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../../services/UserService';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [alert, setAlert] = useState({ message: '', type: '' });

  useEffect(() => {
    const saved = localStorage.getItem('resetEmail');
    if (!saved) {
      navigate('/forgot-password', { replace: true });
    } else {
      setEmail(saved);
    }
  }, [navigate]);

  const showAlert = (message, type = 'error') => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 5000);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const { verificationCode, newPassword, confirmPassword } = form;
    if (newPassword !== confirmPassword) {
      showAlert('Mật khẩu xác nhận không khớp', 'error');
      return;
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(newPassword)) {
      showAlert('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số', 'error');
      return;
    }
    try {
      await UserService.resetPassword({ email, verificationCode, newPassword });
      showAlert('Đặt lại mật khẩu thành công!', 'success');
      localStorage.removeItem('resetEmail');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('ResetPassword error:', err);
      const msg = err.response?.data?.message || err.message || 'Không thể đặt lại mật khẩu';
      showAlert(msg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-center text-2xl font-semibold mb-2">Đặt lại mật khẩu</h2>
        <p className="text-center text-gray-600 mb-4">Email: <span className="font-medium">{email}</span></p>
        {alert.message && (
          <div
            className={`alert mb-4 p-3 rounded ${
              alert.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {alert.message}
          </div>
        )}
        <form id="resetPassword" onSubmit={handleReset}>
          <input
            name="verificationCode"
            placeholder="Mã xác thực"
            value={form.verificationCode}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="newPassword"
            type="password"
            placeholder="Mật khẩu mới"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-sm text-gray-500 mb-4">
            Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
          </p>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded mb-2 hover:bg-blue-700 transition-colors"
          >
            Đặt lại mật khẩu
          </button>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors"
          >
            Quay lại
          </button>
        </form>
      </div>
    </div>
  );
}
export default ResetPassword;