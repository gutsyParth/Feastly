import { useState } from "react";
import type { IMenuItem } from "../types";
import axios from "axios";
import toast from "react-hot-toast";
import { restaurantService } from "../main";
import { BiTrash } from "react-icons/bi";
import { BsCartPlus, BsEye } from "react-icons/bs";
import { FiEyeOff } from "react-icons/fi";
import { LoaderIcon } from "react-hot-toast";
import { useAppData } from "../context/AppContext";

interface MenuItemsProps {
  items: IMenuItem[];
  onItemDeleted: () => void;
  isSeller: boolean;
}

const MenuItems = ({ items, onItemDeleted, isSeller }: MenuItemsProps) => {
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const handleDelete = async (itemId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this item");

    if (!confirm) return;

    try {
      await axios.delete(`${restaurantService}/api/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Item deleted");
      onItemDeleted();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete item");
    }
  };

  const toggleAvailability = async (itemId: string) => {
    try {
      const { data } = await axios.put(
        `${restaurantService}/api/item/status/${itemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(data.message);
      onItemDeleted();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  const { fetchCart } = useAppData();

  const addToCart = async (restaurantId: string, itemId: string) => {
    try {
      setLoadingItemId(itemId);

      const { data } = await axios.post(
        `${restaurantService}/api/cart/add`,
        {
          restaurantId,
          itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(data.message);
      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const isLoading = loadingItemId === item._id;

        return (
          <div
            key={item._id}
            className={`group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
              !item.isAvailable ? "opacity-75" : ""
            }`}
          >
            <div className="relative">
              <img
                src={item.image}
                alt=""
                className={`h-52 w-full object-cover transition duration-300 group-hover:scale-105 ${
                  !item.isAvailable ? "grayscale brightness-75" : ""
                }`}
              />

              {!item.isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-800 shadow">
                    Not Available
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4 p-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    {item.name}
                  </h3>

                  <span className="shrink-0 rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-500">
                    ₹{item.price}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                {isSeller && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAvailability(item._id)}
                      className="rounded-xl bg-gray-100 p-3 text-gray-600 transition hover:bg-gray-200"
                    >
                      {item.isAvailable ? (
                        <BsEye size={18} />
                      ) : (
                        <FiEyeOff size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-xl bg-red-50 p-3 text-red-500 transition hover:bg-red-100"
                    >
                      <BiTrash size={18} />
                    </button>
                  </div>
                )}

                {!isSeller && (
                  <button
                    disabled={!item.isAvailable || isLoading}
                    onClick={() => addToCart(item.restaurantId, item._id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      !item.isAvailable || isLoading
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <LoaderIcon size={18} className="animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <BsCartPlus size={18} />
                        Add to Cart
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuItems;
