import express from 'express';
import passport from 'passport';
// 1. IMPORT HÀM TẠO TOKEN MÀ BẠN ĐÃ CÓ
import generateToken from '../utils/generateToken.js';

const router = express.Router();

/**
 * @route   GET /api/auth/google
 * @desc    Bắt đầu luồng xác thực Google.
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false // 2. Chúng ta không dùng session, chúng ta dùng token
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Đường dẫn Google gọi lại.
 */
router.get(
  '/google/callback',
  // 3. Yêu cầu Passport xử lý, không dùng session
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login?error=true', // Về trang login nếu lỗi
    session: false
  }),

  // 4. NẾU THÀNH CÔNG, HÀM NÀY SẼ CHẠY:
  (req, res) => {
    // 'req.user' lúc này là user mà file passport.js đã tìm thấy/tạo ra
    if (!req.user) {
      return res.redirect('http://localhost:5173/login?error=true');
    }

    // 5. Tạo một JWT Token cho user này (giống hệt logic login)
    const token = generateToken(req.user.id, req.user.role);

    // 6. Chuyển hướng người dùng về một trang "trung gian"
    // trên frontend, đính kèm token và user data trên URL

    // Lấy URL frontend từ .env (bạn đã thêm ở bước 7)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Loại bỏ password_hash trước khi gửi về frontend (rất quan trọng)
    delete req.user.password_hash;

    // Mã hóa user data để gửi qua URL an toàn
    const userJson = encodeURIComponent(JSON.stringify(req.user));

    res.redirect(
      // Chúng ta sẽ tạo trang /auth/callback này ở frontend (Bước 9)
      `${frontendUrl}/auth/callback?token=${token}&user=${userJson}`
    );
  }
);

// Chúng ta không cần /me hoặc /logout ở đây
// vì chúng đã được xử lý bằng JWT (file userRoutes.js)
// và phía client (xóa token)

export default router;