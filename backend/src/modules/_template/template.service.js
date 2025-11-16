import * as templateModel from './template.model.js';
import httpStatus from 'http-status';
import ApiError from '../../core/utils/ApiError.js';

/**
 * Create an item
 * @param {object} itemBody
 * @returns {Promise<object>}
 */
export const createItem = async (itemBody) => {
    // Add any business logic here (e.g., check for duplicates)
    return templateModel.create(itemBody);
};

/**
 * Query for items
 * @param {object} filter - Knex filter
 * @param {object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page
 * @param {number} [options.page] - Current page
 * @returns {Promise<Array>}
 */
export const getAllItems = async (filter, options) => {
    // Add pagination/sorting logic if needed
    const items = await templateModel.findAll(filter);
    return items;
};
