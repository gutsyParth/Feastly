import { useEffect, useState } from "react";
import { riderService } from "../main";
import axios from "axios";
import toast from "react-hot-toast";
import { BiCheckCircle, BiTime, BiPackage } from "react-icons/bi";

interface Props {
  orderId: string;
  onAccepted: () => void;
}

const RiderOrderRequest = ({ orderId, onAccepted }: Props) => {
  const [accepting, setAccepting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onAccepted();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onAccepted]);

  const acceptOrder = async () => {
    try {
      setAccepting(true);

      await axios.post(
        `${riderService}/api/rider/accept/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Order Accepted");
      onAccepted();
    } catch (error: any) {
      toast.error(error.response.data.message);
      onAccepted();
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-xl">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-5 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <BiPackage className="text-3xl" />
            </div>

            <div>
              <p className="text-sm font-medium text-white/80">New Delivery</p>

              <h2 className="text-2xl font-bold">Order Request</h2>
            </div>
          </div>

          <div className="rounded-2xl bg-white/20 px-4 py-3 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center gap-1 text-xs font-medium text-white/80">
              <BiTime className="text-sm" />
              Time Left
            </div>

            <p className="mt-1 text-2xl font-bold">{secondsLeft}s</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Order Reference
          </p>

          <p className="mt-2 text-xl font-bold text-gray-800">
            #{orderId.slice(-6)}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
          <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse" />

          <p className="text-sm font-medium text-yellow-700">
            Accept this order before the timer expires
          </p>
        </div>

        <button
          disabled={accepting}
          onClick={acceptOrder}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <BiCheckCircle className="text-lg" />

          {accepting ? "Accepting..." : "Accept Order"}
        </button>
      </div>
    </div>
  );
};

export default RiderOrderRequest;
