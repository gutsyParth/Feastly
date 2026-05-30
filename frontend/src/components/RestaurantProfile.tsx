import toast from "react-hot-toast";
import { restaurantService } from "../main";
import type { IRestaurant } from "../types";
import { BiEdit, BiMapPin, BiSave } from "react-icons/bi";
import { useState } from "react";
import axios from "axios";
import { useAppData } from "../context/AppContext";

interface props {
  restaurant: IRestaurant;
  isSeller: boolean;
  onUpdate: (restaurant: IRestaurant) => void;
}

const RestaurantProfile = ({ restaurant, isSeller, onUpdate }: props) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(restaurant.name);
  const [description, setDescription] = useState(restaurant.description);
  const [isOpen, setIsOpen] = useState(restaurant.isOpen);
  const [loading, setLoading] = useState(false);

  const toggleOpenStatus = async () => {
    try {
      const { data } = await axios.put(
        `${restaurantService}/api/restaurant/status`,
        {
          status: !isOpen,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(data.message);
      setIsOpen(data.restaurant.isOpen);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const saveChanges = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${restaurantService}/api/restaurant/edit`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onUpdate(data.restaurant);
      setEditMode(false);
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const { setIsAuth, setUser } = useAppData();

  const logoutHandler = async () => {
    await axios.put(
      `${restaurantService}/api/restaurant/status`,
      {
        status: false,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    localStorage.setItem("token", "");
    setIsAuth(false);
    setUser(null);
    toast.success("logged out successfully");
  };

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-[0_25px_80px_rgba(226,55,116,0.35)]">
      {restaurant.image && (
        <img
          src={restaurant.image}
          alt=""
          className="h-56 w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      )}
      <div className="space-y-5 p-6">
        {isSeller && (
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {editMode ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-2 text-xl font-semibold text-gray-800 shadow-sm outline-none backdrop-blur-md transition-all duration-300 focus:border-[#E23774]/50 focus:shadow-[0_0_20px_rgba(226,55,116,0.2)]"
                />
              ) : (
                <h2 className="text-2xl font-bold tracking-tight text-gray-800">
                  {restaurant.name}
                </h2>
              )}

              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <BiMapPin className="h-4 w-4 text-[#E23774]" />
                <span className="leading-relaxed">
                  {restaurant.autoLocation.formattedAddress ||
                    "Location unavailable"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setEditMode(!editMode)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-[#E23774] shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-r hover:from-[#FF512F] hover:via-[#E23774] hover:to-[#FF9966] hover:text-white hover:shadow-xl"
            >
              <BiEdit size={18} />
            </button>
          </div>
        )}

        {editMode ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px] w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-700 shadow-sm outline-none backdrop-blur-md transition-all duration-300 focus:border-[#E23774]/50 focus:shadow-[0_0_20px_rgba(226,55,116,0.2)]"
          />
        ) : (
          <p className="text-sm leading-relaxed text-gray-600">
            {restaurant.description || "No description added"}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-white/30 pt-5">
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide shadow-sm ${
              isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}
          >
            {isOpen ? "OPEN" : "CLOSED"}
          </span>

          <div className="flex gap-3">
            {editMode && (
              <button
                onClick={saveChanges}
                disabled={loading}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
              >
                <BiSave size={16} />
                Save
              </button>
            )}

            {isSeller && (
              <button
                onClick={toggleOpenStatus}
                className={`rounded-2xl px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] ${
                  isOpen
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : "bg-gradient-to-r from-green-500 to-emerald-600"
                }`}
              >
                {isOpen ? "Close Restaurant" : "Open Restaurant"}
              </button>
            )}

            {isSeller && (
              <button
                onClick={logoutHandler}
                className={`rounded-2xl px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] bg-gradient-to-r from-red-500 to-red-600`}
              >
                Logout
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Created on{" "}
          <span className="font-medium">
            {new Date(restaurant.createdAt).toLocaleDateString()}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RestaurantProfile;
