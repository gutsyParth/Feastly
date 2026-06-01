import toast from "react-hot-toast";
import { riderService } from "../main";
import type { IOrder } from "../types";
import axios from "axios";
import {
  BiMap,
  BiPhone,
  BiPackage,
  BiMoney,
  BiCheckCircle,
} from "react-icons/bi";

interface Props {
  order: IOrder;
  onStatusUpdate: () => void;
}

const RiderCurrentOrder = ({ order, onStatusUpdate }: Props) => {
  const updateStatus = async () => {
    try {
      await axios.put(
        `${riderService}/api/rider/order/update/${order._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Order status updated");
      onStatusUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <BiPackage className="text-3xl" />
          </div>

          <div>
            <p className="text-sm font-medium text-white/80">Active Delivery</p>

            <h1 className="text-2xl font-bold">Current Order</h1>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="space-y-4 rounded-2xl bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-500">
              <BiMap className="text-xl" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Pickup Location
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-700">
                {order.restaurantName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-500">
              <BiMap className="text-xl" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Delivery Address
              </p>

              <p className="mt-1 text-sm leading-relaxed text-gray-700">
                {order.deliveryAddress.formattedAddress}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-600">
              <BiMoney className="text-xl" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Order Total
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-gray-800">
              ₹{order.totalAmount}
            </p>
          </div>

          <div className="rounded-2xl bg-yellow-50 p-4">
            <div className="flex items-center gap-2 text-yellow-600">
              <BiMoney className="text-xl" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Your Earning
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-gray-800">
              ₹{order.riderAmount}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Delivery Status
            </p>

            <p className="mt-1 text-sm font-semibold capitalize text-blue-600">
              {order.status.replaceAll("_", " ")}
            </p>
          </div>

          <div className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
            Active
          </div>
        </div>

        {order.deliveryAddress.mobile && (
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <BiPhone className="text-xl" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Customer Contact
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {order.deliveryAddress.mobile}
                </p>
              </div>
            </div>

            <a
              href={`tel:${order.deliveryAddress.mobile}`}
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-600"
            >
              <BiPhone className="text-lg" />
              Call Customer
            </a>
          </div>
        )}

        <div className="pt-2">
          {order.status === "rider_assigned" && (
            <button
              onClick={() => updateStatus()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-500 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-yellow-600"
            >
              <BiCheckCircle className="text-lg" />
              Reached Restaurant
            </button>
          )}

          {order.status === "picked_up" && (
            <button
              onClick={() => updateStatus()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-green-600"
            >
              <BiCheckCircle className="text-lg" />
              Mark as Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderCurrentOrder;
