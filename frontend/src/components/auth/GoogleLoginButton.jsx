// frontend/src/components/auth/GoogleLoginButton.jsx
import React from 'react';

const GoogleLoginButton = () => {
  // URL này trỏ THẲNG đến backend (port 3001)
  // Vì frontend (port 3000) và backend (3001) chạy riêng biệt
  // và file vite.config.js của bạn không có proxy.
  const googleLoginUrl = 'http://localhost:3001/api/auth/google';

  return (
    <a
      href={googleLoginUrl}
      className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      {/* Google Icon SVG */}
      <svg
        className="w-5 h-5 mr-3"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
      >
        <path
          fill="currentColor"
          d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 256S110.3 0 244 0c69.8 0 130.8 28.1 175.8 72.8l-65.7 64.2C331.4 113.3 291.1 96 244 96c-88.8 0-160.1 72.1-160.1 160.1s71.3 160.1 160.1 160.1c98.1 0 135-70.1 140.1-106.3H244v-85.3h236.1c2.3 12.7 3.9 26.1 3.9 41z"
        ></path>
      </svg>
      Đăng nhập với Google
    </a>
  );
};

export default GoogleLoginButton;