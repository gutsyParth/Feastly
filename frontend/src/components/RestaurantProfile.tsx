import toast from "react-hot-toast";
import { restaurantService } from "../main";
import type { IRestaurant } from "../types";
import { BiEdit, BiMapPin, BiSave, BiLogOut, BiStore } from "react-icons/bi";
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
    <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
      {restaurant.image && (
        <div className="relative h-72 overflow-hidden">
          <img
            src={restaurant.image}
            alt=""
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                <BiStore className="text-sm" />
                Restaurant Profile
              </div>

              {editMode ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-white/30 bg-white/20 px-4 py-3 text-3xl font-bold text-white outline-none backdrop-blur-md placeholder:text-white/70"
                />
              ) : (
                <h2 className="text-3xl font-bold text-white">
                  {restaurant.name}
                </h2>
              )}
            </div>

            {isSeller && (
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition hover:scale-105 hover:bg-red-500 hover:text-white"
              >
                <BiEdit size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6 p-6">
        <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-500">
            <BiMapPin className="text-xl" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Restaurant Location
            </p>

            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              {restaurant.autoLocation.formattedAddress ||
                "Location unavailable"}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-gray-700">
            Description
          </p>

          {editMode ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[140px] w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          ) : (
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm leading-relaxed text-gray-600">
                {restaurant.description || "No description added"}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Current Status
            </p>

            <div
              className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {isOpen ? "Restaurant Open" : "Restaurant Closed"}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {editMode && (
              <button
                onClick={saveChanges}
                disabled={loading}
                className="flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600 disabled:opacity-70"
              >
                <BiSave className="text-lg" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            )}

            {isSeller && (
              <button
                onClick={toggleOpenStatus}
                className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-md transition ${
                  isOpen
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isOpen ? "Close Restaurant" : "Open Restaurant"}
              </button>
            )}

            {isSeller && (
              <button
                onClick={logoutHandler}
                className="flex items-center gap-2 rounded-2xl bg-gray-800 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-black"
              >
                <BiLogOut className="text-lg" />
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-400">
            Created on{" "}
            <span className="font-medium text-gray-600">
              {new Date(restaurant.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;
