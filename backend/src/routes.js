import { Router } from 'express';

// Import all module route files
import userRoutes from './modules/users/user.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/products/product.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import wishlistRoutes from './modules/wishlist/wishlist.routes.js';
import orderRoutes from './modules/orders/order.routes.js';
import supportRoutes from './modules/support/support.routes.js';
import notificationRoutes from './modules/notification/notification.routes.js';
import staffRoutes from './modules/staff/staff.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const apiRouter = Router();

// Mount the routes from each module onto the main API router
apiRouter.use('/users', userRoutes);
apiRouter.use('/auth', authRoutes); // For social login (Google, Facebook)
apiRouter.use('/products', productRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/wishlist', wishlistRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/support', supportRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/staff', staffRoutes);
apiRouter.use('/admin', adminRoutes);

export default apiRouter;
