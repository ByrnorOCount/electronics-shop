import * as templateService from './template.service.js';
import httpStatus from 'http-status';
import ApiResponse from '../../core/utils/ApiResponse.js';

/**
 * @summary Create a new item
 * @route POST /api/new-module
 * @access Private
 */
export const createItem = async (req, res, next) => {
    try {
        const newItem = await templateService.createItem(req.body);
        res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, newItem, 'Item created successfully.'));
    } catch (error) {
        next(error);
    }
};

/**
 * @summary Get all items
 * @route GET /api/new-module
 * @access Public
 */
export const getAllItems = async (req, res, next) => {
    try {
        const items = await templateService.getAllItems(req.query); // Pass query for filtering/pagination
        res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, items, 'Items retrieved successfully.'));
    } catch (error) {
        next(error);
    }
};
