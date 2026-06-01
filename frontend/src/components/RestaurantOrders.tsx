import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useSocket } from "../context/SocketContext";
import { restaurantService } from "../main";

import audio from "../assets/restaurantReceivesOrder.mp3";
import type { IOrder } from "../types";
import OrderCard from "./OrderCard";

const ACTIVE_STATUSES = [
  "placed",
  "accepted",
  "preparing",
  "ready_for_rider",
  "rider_assigned",
  "picked_up",
];

const RestaurantOrders = ({ restaurantId }: { restaurantId: string }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const { socket } = useSocket();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(audio);
    audioRef.current.load();
  }, []);

  const unlockAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          audioRef.current!.pause();
          audioRef.current!.currentTime = 0;
          setAudioUnlocked(true);
          console.log("Audio unlocked");
        })
        .catch((err) => {
          console.log("Failed to unlock audio: ", err);
        });
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${restaurantService}/api/order/restaurant/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [restaurantId]);

  useEffect(() => {
    if (!socket) return;

    const onNewOrder = () => {
      if (audioUnlocked && audioRef.current) {
        audioRef.current.currentTime = 0;

        audioRef.current.play().catch((err) => {
          console.log("Audio play failed:", err);
        });
      }

      fetchOrders();
    };

    socket.on("order:new", onNewOrder);

    return () => {
      socket.off("order:new", onNewOrder);
    };
  }, [socket, audioUnlocked]);

  useEffect(() => {
    if (!socket) return;

    const onUpdateOrder = () => {
      fetchOrders();
    };

    socket.on("order:rider_assigned", onUpdateOrder);

    return () => {
      socket.off("order:rider_assigned", onUpdateOrder);
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="rounded-3xl bg-white px-8 py-6 shadow-lg">
          <p className="text-sm font-medium text-gray-500">Loading Orders...</p>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));

  const completeOrders = orders.filter(
    (o) => !ACTIVE_STATUSES.includes(o.status)
  );

  return (
    <div className="space-y-10">
      {!audioUnlocked && (
        <div className="flex flex-col gap-5 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-3xl shadow-sm">
              🔔
            </div>

            <div>
              <h3 className="text-lg font-bold text-blue-900">
                Enable Sound Notifications
              </h3>

              <p className="mt-1 text-sm leading-relaxed text-blue-700">
                Hear a notification sound whenever a new order arrives
              </p>
            </div>
          </div>

          <button
            onClick={unlockAudio}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
          >
            Enable Sound
          </button>
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Active Orders</h3>

            <p className="mt-1 text-sm text-gray-500">
              Orders currently being processed
            </p>
          </div>

          <div className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-500">
            {activeOrders.length} Active
          </div>
        </div>

        {activeOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              🍽️
            </div>

            <h4 className="text-lg font-semibold text-gray-700">
              No Active Orders
            </h4>

            <p className="mt-2 text-sm text-gray-500">
              New incoming orders will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {activeOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onStatusUpdate={fetchOrders}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              Completed Orders
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Successfully delivered or completed orders
            </p>
          </div>

          <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
            {completeOrders.length} Completed
          </div>
        </div>

        {completeOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              📦
            </div>

            <h4 className="text-lg font-semibold text-gray-700">
              No Completed Orders
            </h4>

            <p className="mt-2 text-sm text-gray-500">
              Completed orders will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {completeOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onStatusUpdate={fetchOrders}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOrders;
