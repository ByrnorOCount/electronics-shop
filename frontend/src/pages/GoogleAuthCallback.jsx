// frontend/src/pages/GoogleAuthCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

// Trang này là trang "trung gian"
// Nó bắt "token" và "user" từ URL mà backend gửi về
// sau đó lưu vào Redux và chuyển hướng người dùng

const GoogleAuthCallback = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    // useSearchParams là hook để đọc query params từ URL
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Lấy 'token' và 'user' từ URL
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (token && userParam) {
            try {
                // Giải mã user data (vì nó đã bị mã hóa để gửi qua URL)
                const user = JSON.parse(decodeURIComponent(userParam));

                // LƯU VÀO REDUX VÀ LOCALSTORAGE
                // Đây chính là hành động mấu chốt!
                dispatch(setCredentials({ token, user }));

                // Thông báo chào mừng và chuyển hướng
                toast.success(`Chào mừng trở lại, ${user.first_name}!`);
                navigate('/profile'); // Chuyển về trang profile

            } catch (error) {
                console.error("Lỗi giải mã user data từ URL:", error);
                toast.error('Đăng nhập Google thất bại. Vui lòng thử lại.');
                navigate('/login');
            }
        } else {
            // Nếu không có token, nghĩa là đăng nhập lỗi
            toast.error('Đăng nhập Google thất bại. Vui lòng thử lại.');
            navigate('/login');
        }

        // Chỉ chạy 1 lần duy nhất khi trang được tải
    }, [dispatch, navigate, searchParams]);

    // Hiển thị thông báo loading trong khi xử lý
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg">Đang xác thực, vui lòng chờ...</p>
        </div>
    );
};

export default GoogleAuthCallback;