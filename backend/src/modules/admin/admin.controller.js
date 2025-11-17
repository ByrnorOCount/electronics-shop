import * as adminService from "./admin.service.js";
import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";

/**
 * Get all users in the system.
 * @route GET /api/admin/users
 * @access Admin
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers(req.query);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(httpStatus.OK, users, "Users retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a user's role.
 * @route PUT /api/admin/users/:userId
 * @access Admin
 */
export const updateUserRole = async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const updatedUser = await adminService.updateUserRole(userId, role);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          updatedUser,
          "User role updated successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a user.
 * @route DELETE /api/admin/users/:userId
 * @access Admin
 */
export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    await adminService.deleteUser(userId, req.user.id);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Get dashboard metrics.
 * @route GET /api/admin/dashboard
 * @access Admin
 */
export const getDashboardMetrics = async (req, res, next) => {
  try {
    const metrics = await adminService.getDashboardMetrics();
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          metrics,
          "Dashboard metrics retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new category.
 * @route POST /api/admin/categories
 * @access Admin
 */
export const createCategory = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const newCategory = await adminService.createCategory({
      name,
      description,
    });
    res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(
          httpStatus.CREATED,
          newCategory,
          "Category created successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all categories.
 * @route GET /api/admin/categories
 * @access Admin
 */
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await adminService.getAllCategories();
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          categories,
          "Categories retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a category.
 * @route PUT /api/admin/categories/:categoryId
 * @access Admin
 */
export const updateCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;
  try {
    const updatedCategory = await adminService.updateCategory(categoryId, {
      name,
      description,
    });
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          updatedCategory,
          "Category updated successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a category.
 * @route DELETE /api/admin/categories/:categoryId
 * @access Admin
 */
export const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    await adminService.deleteCategory(categoryId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
