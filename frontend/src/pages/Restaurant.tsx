import { useEffect, useState } from "react";
import type { IRestaurant } from "../types";
import { restaurantService } from "../main";
import AddRestaurant from "../components/AddRestaurant";
import axios from "axios";
import RestaurantProfile from "../components/RestaurantProfile";

type SellerTab = "menu" | "add-item" | "sales";

const Restaurant = () => {
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<SellerTab>("menu");

  const fetchMyRestaurant = async () => {
    try {
      const { data } = await axios.get(
        `${restaurantService}/api/restaurant/my`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRestaurant(data.restaurant || null);

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRestaurant();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading your restaurant....</p>
      </div>
    );

  if (!restaurant) {
    return <AddRestaurant fetchMyRestaurant={fetchMyRestaurant} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-100 px-4 py-8 space-y-8">
      <RestaurantProfile
        restaurant={restaurant}
        onUpdate={setRestaurant}
        isSeller={true}
      />
      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-[0_25px_80px_rgba(226,55,116,0.25)]">
        <div className="flex border-b border-white/30 bg-white/40 backdrop-blur-md">
          {[
            { key: "menu", label: "Menu Items" },
            { key: "add-item", label: "Add Item" },
            {
              key: "sales",
              label: "Sales",
            },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as SellerTab)}
              className={`relative flex-1 px-5 py-4 text-sm font-semibold transition-all duration-300 ${
                tab == t.key
                  ? "bg-gradient-to-r from-[#FF512F]/10 via-[#E23774]/10 to-[#FF9966]/10 text-[#E23774]"
                  : "text-gray-500 hover:bg-white/50 hover:text-gray-700"
              }`}
            >
              {tab == t.key && (
                <span className="absolute bottom-0 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966]"></span>
              )}

              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "menu" && (
            <div className="rounded-2xl border border-dashed border-[#E23774]/20 bg-white/40 p-10 text-center shadow-inner backdrop-blur-sm">
              <p className="text-sm font-medium text-gray-600">Menu Items</p>
            </div>
          )}

          {tab === "add-item" && (
            <div className="rounded-2xl border border-dashed border-[#E23774]/20 bg-white/40 p-10 text-center shadow-inner backdrop-blur-sm">
              <p className="text-sm font-medium text-gray-600">Add Item Page</p>
            </div>
          )}

          {tab === "sales" && (
            <div className="rounded-2xl border border-dashed border-[#E23774]/20 bg-white/40 p-10 text-center shadow-inner backdrop-blur-sm">
              <p className="text-sm font-medium text-gray-600">Sales Page</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
