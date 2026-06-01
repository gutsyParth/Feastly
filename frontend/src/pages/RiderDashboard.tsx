import { useEffect, useRef, useState } from "react";
import { useAppData } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";
import { riderService } from "../main";
import axios from "axios";
import toast from "react-hot-toast";
import { BiUpload } from "react-icons/bi";
import type { IOrder } from "../types";
import audio from "../assets/riderReceivesNotification.mp3";
import RiderOrderRequest from "../components/RiderOrderRequest";
import RiderCurrentOrder from "../components/RiderCurrentOrder";
import RiderOrderMap from "../components/RiderOrderMap";

interface IRider {
  _id: string;
  phoneNumber: string;
  aadhaarNumber: string;
  drivingLicenseNumber: string;
  picture: string;
  isVerified: boolean;
  isAvailable: boolean;
}

const RiderDashboard = () => {
  const { user } = useAppData();
  const { socket } = useSocket();

  const [profile, setProfile] = useState<IRider | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [incomingOrders, setIncomingOrders] = useState<string[]>([]);
  const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);

  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(audio);
    audioRef.current.preload = "auto";
  }, []);

  const unlockAudio = async () => {
    try {
      if (!audioRef.current) return;
      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioUnlocked(true);
      toast.success("Sound enabled");
    } catch (error) {
      toast.error("Tap again to enable sound");
    }
  };

  useEffect(() => {
    if (!socket) return;

    const onOrderAvailable = ({ orderId }: { orderId: string }) => {
      setIncomingOrders((prev) =>
        prev.includes(orderId) ? prev : [...prev, orderId]
      );

      if (audioUnlocked && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      setTimeout(() => {
        setIncomingOrders((prev) => prev.filter((id) => id != orderId));
      }, 10000);
    };

    socket.on("order:available", onOrderAvailable);

    return () => {
      socket.off("order:available", onOrderAvailable);
    };
  }, [socket, audioUnlocked]);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${riderService}/api/rider/myprofile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setProfile(data || null);
    } catch (error) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "rider") fetchProfile();
    else setLoading(false);
  }, [user]);

  const fetchCurrentOrder = async () => {
    try {
      const { data } = await axios.get(
        `${riderService}/api/rider/order/current`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setCurrentOrder(data.order);
    } catch (error) {
      console.log(error);
      setCurrentOrder(null);
    }
  };

  useEffect(() => {
    fetchCurrentOrder();
  }, []);

  const toggleAvailability = async () => {
    if (!navigator.geolocation) {
      toast.error("Location access required");
      return;
    }

    setToggling(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await axios.patch(
          `${riderService}/api/rider/toggle`,
          {
            isAvailable: !profile?.isAvailable,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.success(
          profile?.isAvailable ? "You are offline" : "You are online"
        );

        fetchProfile();
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setToggling(false);
      }
    });
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!navigator.geolocation) {
      toast.error("Location access required");
      return;
    }

    setSubmitting(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const formData = new FormData();

      formData.append("phoneNumber", phoneNumber);
      formData.append("aadhaarNumber", aadhaarNumber);
      formData.append("drivingLicenseNumber", drivingLicenseNumber);
      formData.append("latitude", pos.coords.latitude.toString());
      formData.append("longitude", pos.coords.longitude.toString());

      if (image) {
        formData.append("file", image);
      }

      try {
        const { data } = await axios.post(
          `${riderService}/api/rider/new`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.success(data.message);
        fetchProfile();
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setSubmitting(false);
      }
    });
  };

  if (user?.role !== "rider") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        You are not registered as a rider
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        Loading rider details...
      </div>
    );
  }

  if (!profile)
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-100 px-4 py-10">
        <div className="mx-auto max-w-lg space-y-6 rounded-3xl border border-white/40 bg-white/70 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-[0_25px_80px_rgba(226,55,116,0.35)]">
          <h1 className="text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] bg-clip-text text-transparent">
            Add Your Profile
          </h1>
          <input
            type="number"
            placeholder="Aadhaar number"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            className="w-full rounded-2xl border border-white/40 bg-white/70 px-5 py-3 text-sm text-gray-700 shadow-sm outline-none backdrop-blur-md transition-all duration-300 placeholder:text-gray-400 focus:border-[#E23774]/50 focus:shadow-[0_0_25px_rgba(226,55,116,0.18)]"
          />
          <input
            type="number"
            placeholder="Contact Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full rounded-2xl border border-white/40 bg-white/70 px-5 py-3 text-sm text-gray-700 shadow-sm outline-none backdrop-blur-md transition-all duration-300 placeholder:text-gray-400 focus:border-[#E23774]/50 focus:shadow-[0_0_25px_rgba(226,55,116,0.18)]"
          />

          <input
            type="text"
            placeholder="Driving License"
            value={drivingLicenseNumber}
            onChange={(e) => setDrivingLicenseNumber(e.target.value)}
            className="w-full rounded-2xl border border-white/40 bg-white/70 px-5 py-3 text-sm text-gray-700 shadow-sm outline-none backdrop-blur-md transition-all duration-300 placeholder:text-gray-400 focus:border-[#E23774]/50 focus:shadow-[0_0_25px_rgba(226,55,116,0.18)]"
          />

          <label className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#E23774]/30 bg-white/60 p-5 text-sm text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E23774]/60 hover:bg-white/80 hover:shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] shadow-md">
              <BiUpload className="h-5 w-5 text-white" />
            </div>

            <span className="font-medium group-hover:text-[#E23774] transition-colors duration-300">
              {image ? image.name : "Upload your image"}
            </span>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>

          <button
            className="w-full rounded-2xl bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(226,55,116,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Submitting..." : "Add Profile"}
          </button>
        </div>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-md px-4 py-4">
        <div className="rounded-xl bg-white p-4 shadow space-y-3">
          <img
            src={profile.picture}
            className="mx-auto h-24 w-24 rounded-full object-cover"
            alt=""
          />
          <p className="text-center font-semibold">{user?.name}</p>
          <p className="text-center text-sm text-gray-500">
            {profile.phoneNumber}
          </p>

          <div className="flex justify-center gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
              {profile.isVerified ? "Verified" : "Pending"}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
              {profile.isAvailable ? "Online" : "Offline"}
            </span>
          </div>
          <div>
            <p>
              Please be within a 500 m radius of any restaurant (which we call a
              hotspot) before going online as rider to receive orders.
            </p>
          </div>

          {profile.isVerified && !currentOrder && (
            <button
              onClick={toggleAvailability}
              disabled={toggling}
              className={`w-full py-2 rounded-lg text-white font-semibold ${
                toggling
                  ? "bg-gray-400"
                  : profile.isAvailable
                  ? "bg-gray-600"
                  : "bg-[#e23744]"
              }`}
            >
              {toggling
                ? "Updating..."
                : profile.isAvailable
                ? "Go Offline"
                : "Go Online"}
            </button>
          )}
        </div>
      </div>

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

      {profile.isAvailable && incomingOrders.length > 0 && (
        <div className="mx-auto max-w-md px-4 space-y-3">
          <h3 className="font-semibold text-gray-700">Incoming Orders</h3>

          {incomingOrders.map((id) => (
            <RiderOrderRequest
              key={id}
              orderId={id}
              onAccepted={() => {
                fetchProfile();
                fetchCurrentOrder();
              }}
            />
          ))}
        </div>
      )}
      {currentOrder && (
        <div className="mx-auto max-w-md px-4 space-y-4">
          <RiderCurrentOrder
            order={currentOrder}
            onStatusUpdate={fetchCurrentOrder}
          />
          <RiderOrderMap order={currentOrder} />
        </div>
      )}
    </div>
  );
};

export default RiderDashboard;
