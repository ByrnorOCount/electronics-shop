import * as adminModel from './admin.model.js';
import ApiError from '../../core/utils/ApiError.js';
import httpStatus from 'http-status';

/**
 * Get dashboard analytics data
 * @returns {Promise<Object>}
 */
export const getDashboardMetrics = async () => {
    const data = await adminModel.getDashboardMetrics();
    return data;
};

/**
 * Get all users
 * @param {object} filters - Filters for users
 * @returns {Promise<Array>}
 */
export const getAllUsers = async (filters) => {
    // The model function doesn't currently use filters, but we pass it for future-proofing
    const users = await adminModel.findAllUsers(filters);
    return users;
};

/**
 * Update a user's role
 * @param {number} userId
 * @param {string} role
 * @returns {Promise<Object>}
 */
export const updateUserRole = async (userId, role) => {
    const updatedUser = await adminModel.updateUserRole(userId, role);
    if (!updatedUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return updatedUser;
};

/**
 * Delete a user
 * @param {number} userIdToDelete
 * @param {number} currentAdminId
 * @returns {Promise<void>}
 */
export const deleteUser = async (userIdToDelete, currentAdminId) => {
    if (Number(userIdToDelete) === currentAdminId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot delete your own admin account.');
    }
    const deletedCount = await adminModel.deleteUser(userIdToDelete);
    if (deletedCount === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');
    }
};

/**
 * Create a new category
 * @param {object} categoryData
 * @returns {Promise<Object>}
 */
export const createCategory = async (categoryData) => {
    const newCategory = await adminModel.createCategory(categoryData);
    return newCategory;
};

/**
 * Get all categories
 * @returns {Promise<Array>}
 */
export const getAllCategories = async () => {
    const categories = await adminModel.findAllCategories();
    return categories;
};

/**
 * Update a category
 * @param {number} categoryId
 * @param {object} updateData
 * @returns {Promise<Object>}
 */
export const updateCategory = async (categoryId, updateData) => {
    const updatedCategory = await adminModel.updateCategory(categoryId, updateData);
    if (!updatedCategory) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found.');
    }
    return updatedCategory;
};

/**
 * Delete a category
 * @param {number} categoryId
 * @returns {Promise<void>}
 */
export const deleteCategory = async (categoryId) => {
    const deletedCount = await adminModel.deleteCategory(categoryId);
    if (deletedCount === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found.');
    }
};
