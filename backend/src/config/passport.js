import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from './db.js';

// Configure the Google OAuth 2.0 strategy
passport.use(
    new GoogleStrategy(
        {
            // Lấy thông tin từ file .env
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // Đây chính là URL bạn đã cài đặt trong Google Cloud Console
            callbackURL: '/api/auth/google/callback',
            proxy: true, // Cho phép proxy (quan trọng khi deploy)
        },
        async (accessToken, refreshToken, profile, done) => {
            // Hàm này được gọi sau khi Google xác thực thành công
            // 'profile' chứa thông tin (id, email, tên)

            // Lấy thông tin cơ bản từ Google profile
            const googleEmail = profile.emails[0].value;
            const googleProviderId = profile.id; // Đây là ID của Google

            try {
                // 1. Tìm user bằng provider_id và provider 'google'
                let user = await db('users')
                    .where({
                        provider_id: googleProviderId,
                        provider: 'google'
                    })
                    .first();

                if (user) {
                    // Nếu tìm thấy, user đã tồn tại, cho đăng nhập
                    return done(null, user); // 'done' với user tìm thấy
                }

                // 2. Nếu không có, kiểm tra xem có tài khoản 'local' nào 
                // dùng email này không
                let existingLocalUser = await db('users')
                    .where({
                        email: googleEmail,
                        provider: 'local' // Quan trọng: chỉ tìm tài khoản 'local'
                    })
                    .first();

                if (existingLocalUser) {
                    // Nếu có (nghĩa là user đã đăng ký bằng email/pass),
                    // chúng ta "liên kết" tài khoản Google này vào
                    const [linkedUser] = await db('users')
                        .where({ id: existingLocalUser.id })
                        .update({
                            // Chúng ta sẽ cập nhật provider_id cho tài khoản local này
                            provider_id: googleProviderId,
                            // Bạn có thể chọn cập nhật provider thành 'google'
                            // hoặc giữ nguyên 'local' nhưng vẫn có provider_id
                            // Cập nhật thành 'google' sẽ rõ ràng hơn
                            provider: 'google',
                            is_verified: true // Cập nhật trạng thái xác thực luôn
                        })
                        .returning('*'); // Trả về user đã được cập nhật

                    return done(null, linkedUser);
                }

                // 3. Nếu không có tài khoản nào khớp (cả provider_id lẫn email local),
                // đây là user mới, hãy tạo họ
                const [newUser] = await db('users')
                    .insert({
                        // Nếu không có first_name, dùng displayName, nếu không có nữa thì dùng "User"
                        first_name: profile.name.givenName || profile.displayName || 'User',
                        // Nếu không có last_name, dùng familyName, dùng tạm dấu "."
                        last_name: profile.name.familyName || '.',
                        // Email từ Google 
                        email: googleEmail,
                        provider: 'google', // Đặt provider là 'google'
                        provider_id: googleProviderId, // Đặt provider_id
                        is_verified: true, // Email từ Google đã được xác thực
                        // password_hash sẽ là null (vì DB đã cho phép)
                    })
                    .returning('*'); // Trả về user vừa tạo

                return done(null, newUser);
            } catch (error) {
                console.error('Error in Passport Google Strategy:', error);
                return done(error, null);
            }
        }
    )
);