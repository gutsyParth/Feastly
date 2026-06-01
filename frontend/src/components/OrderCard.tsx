import axios from "axios";
import type { IOrder } from "../types";
import { ORDER_ACTIONS } from "../utils/orderflow";
import { restaurantService } from "../main";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { BiCheckCircle, BiRefresh, BiReceipt, BiRupee } from "react-icons/bi";

interface props {
  order: IOrder;
  onStatusUpdate?: () => void;
}

const statusColor = (status: string) => {
  switch (status) {
    case "placed":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";

    case "accepted":
      return "bg-orange-100 text-orange-700 border border-orange-200";

    case "preparing":
      return "bg-blue-100 text-blue-700 border border-blue-200";

    case "ready_for_rider":
      return "bg-indigo-100 text-indigo-700 border border-indigo-200";

    case "picked_up":
      return "bg-purple-100 text-purple-700 border border-purple-200";

    case "delivered":
      return "bg-green-100 text-green-700 border border-green-200";

    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

const OrderCard = ({ order, onStatusUpdate }: props) => {
  const [loading, setLoading] = useState(false);
  const [retryVisible, setRetryVisible] = useState(false);

  const actions = ORDER_ACTIONS[order.status] || [];

  useEffect(() => {
    if (order.status !== "ready_for_rider") {
      setRetryVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setRetryVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [order.status]);

  const updateStatus = async (status: string) => {
    try {
      setLoading(true);
      setRetryVisible(false);

      await axios.put(
        `${restaurantService}/api/order/${order._id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Order Update");
      onStatusUpdate?.();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-md transition hover:shadow-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
              <BiReceipt className="text-xl" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Order ID
              </p>

              <p className="text-sm font-bold text-gray-800">
                #{order._id.slice(-6)}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${statusColor(
            order.status
          )}`}
        >
          {order.status.replaceAll("_", " ")}
        </span>
      </div>

      <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">{item.name}</span>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">
              x {item.quantity}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3">
        <div className="flex items-center gap-2 text-red-500">
          <BiRupee className="text-lg" />

          <span className="text-sm font-semibold">Total Amount</span>
        </div>

        <span className="text-lg font-bold text-gray-800">
          ₹{order.totalAmount}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3">
        <span className="text-sm font-medium text-gray-500">
          Payment Status
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            order.paymentStatus === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.paymentStatus}
        </span>
      </div>

      {order.paymentStatus === "paid" && actions.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-3">
          {actions.map((status) => (
            <button
              key={status}
              disabled={loading}
              onClick={() => updateStatus(status)}
              className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <BiCheckCircle className="text-base" />
              Mark as {status.replaceAll("_", " ")}
            </button>
          ))}
        </div>
      )}

      {order.status === "ready_for_rider" && retryVisible && (
        <div className="mt-5">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-50 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-100 disabled:opacity-50"
            onClick={() => updateStatus("ready_for_rider")}
          >
            <BiRefresh className="text-lg" />
            Retry Ready For Rider
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
