import { createNotification } from '../notification/notification.service.js';
import * as Staff from './staff.model.js';

/**
 * Create a new product.
 * @route POST /api/staff/products
 * @access Staff
 */
export const createProduct = async (req, res) => {
  const { name, description, category_id, price, stock, image_url, is_featured } = req.body;
  if (!name || !price || stock === undefined) {
    return res.status(400).json({ message: 'Name, price, and stock are required.' });
  }

  try {
    const newProduct = await Staff.createProduct({ name, description, category_id, price, stock, image_url, is_featured });
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
  const { name, description, category_id, price, stock, image_url, is_featured } = req.body;

  const updateData = { name, description, category_id, price, stock, image_url, is_featured };

  try {
    const updatedProduct = await Staff.updateProduct(id, updateData);
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
    const deletedCount = await Staff.deleteProduct(id);
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
 * Get all products (for staff view).
 * @route GET /api/staff/products
 * @access Staff
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Staff.findAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching all products for staff:', error);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

/**
 * Get all orders from all users.
 * @route GET /api/staff/orders
 * @access Staff
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Staff.findAllOrders();
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
    const updatedOrder = await Staff.updateOrderStatus(id, status);
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
    const tickets = await Staff.findAllSupportTickets();
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching all support tickets:', error);
    res.status(500).json({ message: 'Server error while fetching support tickets.' });
  }
};

// todo: /staff/support-tickets/:tickedId

/**
 * Reply to a support ticket.
 * @route POST /api/staff/support-tickets/:ticketId/reply
 * @access Staff
 */
export const replyToTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { message } = req.body;
  const staffId = req.user.id;

  if (!message) {
    return res.status(400).json({ message: 'Reply message cannot be empty.' });
  }

  try {
    const ticket = await Staff.findSupportTicketById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found.' });
    }

    const newReply = await Staff.createSupportTicketReply({
      ticket_id: ticketId,
      user_id: staffId,
      message: message,
    });

    // Optionally, update the ticket status to 'in_progress' or 'answered'
    await Staff.updateSupportTicketStatus(ticketId, 'in_progress');

    // Notify the user that their ticket has a new reply
    await createNotification(ticket.user_id, `Your support ticket #${ticketId} has a new reply from staff.`);

    res.status(201).json(newReply);
  } catch (error) {
    console.error('Error replying to support ticket:', error);
    res.status(500).json({ message: 'Server error while replying to ticket.' });
  }
};
