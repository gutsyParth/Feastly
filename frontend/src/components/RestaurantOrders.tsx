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

  if (loading) {
    return <p className="text-gray-500">Loading Orders</p>;
  }
  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));

  const completeOrders = orders.filter(
    (o) => !ACTIVE_STATUSES.includes(o.status)
  );

  return (
    <div className="space-y-6">
      {!audioUnlocked && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>

            <div>
              <p className="font-medium text-blue-900">
                Enable Sound Notification
              </p>
              <p className="text-sm text-blue-700">
                Get notified when new orders arrive
              </p>
            </div>
          </div>

          <button onClick={unlockAudio}>Enable Sound</button>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Active Orders</h3>

        {activeOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No Acitve orders</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Completed Orders</h3>

        {completeOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No completed orders</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
