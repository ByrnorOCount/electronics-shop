import db from '../config/db.js';

/**
 * Create a new product.
 * @route POST /api/staff/products
 * @access Staff
 */
export const createProduct = async (req, res) => {
  const { name, description, category, price, stock, image_url, is_featured } = req.body;
  if (!name || !price || stock === undefined) {
    return res.status(400).json({ message: 'Name, price, and stock are required.' });
  }

  try {
    const [newProduct] = await db('products')
      .insert({ name, description, category, price, stock, image_url, is_featured })
      .returning('*');
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error while creating product.' });
  }
};

/**
 * Update an existing product.
 * @route PUT /api/staff/products/:id
 * @access Staff
 */
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, stock, image_url, is_featured } = req.body;

  const updateData = { name, description, category, price, stock, image_url, is_featured };

  try {
    const [updatedProduct] = await db('products').where({ id }).update(updateData).returning('*');
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error while updating product.' });
  }
};

/**
 * Delete a product.
 * @route DELETE /api/staff/products/:id
 * @access Staff
 */
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCount = await db('products').where({ id }).del();
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error while deleting product.' });
  }
};

/**
 * Get all orders from all users.
 * @route GET /api/staff/orders
 * @access Staff
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await db('orders').orderBy('created_at', 'desc');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders.' });
  }
};

/**
 * Update the status of an order.
 * @route PUT /api/staff/orders/:id
 * @access Staff
 */
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required.' });
  }

  try {
    const [updatedOrder] = await db('orders').where({ id }).update({ status }).returning('*');
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error while updating order status.' });
  }
};

/**
 * Get all support tickets from all users.
 * @route GET /api/staff/support-tickets
 * @access Staff
 */
export const getAllSupportTickets = async (req, res) => {
  try {
    const tickets = await db('support_tickets').orderBy('created_at', 'desc');
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching all support tickets:', error);
    res.status(500).json({ message: 'Server error while fetching support tickets.' });
  }
};
