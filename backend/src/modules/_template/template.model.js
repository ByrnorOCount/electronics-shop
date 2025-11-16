import db from '../../config/db.js';

/**
 * Create an item
 * @param {object} itemBody
 * @returns {Promise<object>}
 */
export const create = async (itemBody) => {
    const [newItem] = await db('items_table_name').insert(itemBody).returning('*');
    return newItem;
};

/**
 * Find all items
 * @param {object} filter
 * @returns {Promise<Array>}
 */
export const findAll = (filter) => {
    // Example: return db('items_table_name').where(filter);
    return db('items_table_name').select('*');
};
