import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserService from '../../../services/UserService';

function UserUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        phone: '',
        address: '',
        gender: 'male',
        role: 'USER',
        status: true
    });
    
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [changePassword, setChangePassword] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await UserService.getById(id);
                setFormData({
                    username: userData.username || '',
                    email: userData.email || '',
                    fullName: userData.fullName || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    gender: userData.gender || 'male',
                    role: userData.role || 'USER',
                    status: userData.status !== false
                });
                
                // If the user has an image, set the image preview
                if (userData.image) {
                    // Use the authenticated method to fetch the image
                    fetchProfileImage(userData.image);
                }
                
                setInitialLoading(false);
            } catch (error) {
                console.error('Error fetching user:', error);
                toast.error(`Failed to fetch user data: ${error.message || 'Unknown error'}`);
                navigate('/admin/user');
            }
        };
        
        fetchUser();
    }, [id, navigate]);

    // Function to fetch the profile image with authentication
    const fetchProfileImage = async (imageName) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:8080/uploads/users/${imageName}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                setImagePreview(URL.createObjectURL(blob));
            } else {
                console.error('Failed to load image');
                setImagePreview(null);
            }
        } catch (error) {
            console.error('Error loading image:', error);
            setImagePreview(null);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        
        // Password validation if changing password
        if (changePassword && !password) {
            newErrors.password = 'Password is required when changing password';
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            // Create update payload
            const updateData = {
                ...formData
            };
            
            // Only include password if changing it
            if (changePassword) {
                updateData.password = password;
            }
            
            console.log("Updating user data:", updateData);
            console.log("With image:", profileImage);
            
            const response = await UserService.update(id, updateData, profileImage);
            toast.success('User updated successfully!');
            navigate('/admin/user');
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error(`Failed to update user: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        setImagePreview(null);
    };

    if (initialLoading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Update User</h1>
            
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                </div>
                
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={changePassword}
                            onChange={() => setChangePassword(!changePassword)}
                            className="mr-2"
                        />
                        <span className="text-gray-700 text-sm font-bold">Change Password</span>
                    </label>
                </div>
                
                {changePassword && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className={`shadow appearance-none border ${errors.password ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        />
                        {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
                    </div>
                )}
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`shadow appearance-none border ${errors.email ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`shadow appearance-none border ${errors.fullName ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs italic">{errors.fullName}</p>}
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Gender
                    </label>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="male"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label htmlFor="male" className="mr-4">Male</label>
                        
                        <input
                            type="radio"
                            id="female"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label htmlFor="female">Female</label>
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                        Profile Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {imagePreview && (
                        <div className="mt-2 flex items-center">
                            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="ml-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        Role
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="status"
                            checked={formData.status}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span className="text-gray-700 text-sm font-bold">Active</span>
                    </label>
                </div>
                
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {loading ? 'Updating...' : 'Update User'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/user')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UserUpdate;