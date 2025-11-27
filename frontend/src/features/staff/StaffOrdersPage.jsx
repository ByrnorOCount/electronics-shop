import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { staffService } from "../../api";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency, formatStatus } from "../../utils/formatters";
import Button from "../../components/ui/Button";
import OrderDetails from "../checkout-orders/components/OrderDetails";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import Icon from "../../components/ui/Icon";

const OrderRow = ({ order, onStatusUpdate, onOpenModal }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          #{order.id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          {order.customer_name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          {new Date(order.created_at).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          {formatCurrency(Number(order.total_amount))}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              {
                pending: "bg-yellow-100 text-yellow-800",
                processing: "bg-yellow-100 text-yellow-800",
                shipped: "bg-blue-100 text-blue-800",
                delivered: "bg-green-100 text-green-800",
                cancelled: "bg-red-100 text-red-800",
              }[order.status.toLowerCase()] || "bg-gray-100 text-gray-800"
            }`}
          >
            {formatStatus(order.status)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          >
            {isDetailsOpen ? "Hide" : "Details"}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onOpenModal(order)}
          >
            Update
          </Button>
        </td>
      </tr>
      {isDetailsOpen && (
        <tr>
          <td colSpan="6" className="p-4 bg-gray-50">
            <div className="relative">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
              <OrderDetails order={order} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const StaffOrdersPage = () => {
  const {
    data: orders,
    status,
    error,
    request: fetchAllOrders,
    setData: setOrders,
  } = useApi(staffService.getAllOrders, { defaultData: [] });

  const [modalOrder, setModalOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const { isLoading: isUpdating, request: updateOrderStatus } = useApi(
    staffService.updateOrderStatus
  );

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const handleOpenModal = (order) => {
    setModalOrder(order);
    setSelectedStatus(order.status);
  };

  const handleCloseModal = () => {
    setModalOrder(null);
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  const handleSaveStatus = async () => {
    if (!modalOrder) return;
    try {
      const updatedOrder = await updateOrderStatus(modalOrder.id, {
        status: selectedStatus,
      });
      handleOrderUpdate(updatedOrder);
      toast.success(`Order #${modalOrder.id} status updated!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    } finally {
      handleCloseModal();
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <p className="text-red-500 p-8">
        Error: {error?.message || "Failed to load orders."}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {orders.length === 0 ? (
          <p className="text-gray-800">There are no orders to display.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 font-medium">
                {orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onStatusUpdate={handleOrderUpdate} // Kept for potential other update types
                    onOpenModal={handleOpenModal}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modalOrder && (
        <Modal
          isOpen={!!modalOrder}
          onClose={handleCloseModal}
          title={`Update Status for Order #${modalOrder.id}`}
        >
          <div className="p-4">
            <p className="mb-4">Select the new status for this order.</p>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveStatus}
                disabled={isUpdating || selectedStatus === modalOrder.status}
              >
                {isUpdating ? "Saving..." : "Save Status"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StaffOrdersPage;
