import toast from "react-hot-toast";
import { adminService } from "../main";
import axios from "axios";
import { BiCheckShield, BiMap, BiPhone } from "react-icons/bi";

const AdminRestaurantCard = ({
  restaurant,
  onVerify,
}: {
  restaurant: any;
  onVerify: () => void;
}) => {
  const verify = async () => {
    try {
      await axios.patch(
        `${adminService}/api/v1/verify/restaurant/${restaurant._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Restaurant verified");
      onVerify();
    } catch (error) {
      toast.error("failed to verify restaurant");
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative">
        <img
          src={restaurant.image}
          className="h-52 w-full object-cover"
          alt=""
        />

        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-green-600 shadow">
          Pending Verification
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>

          <p className="mt-1 text-sm text-gray-500">
            Restaurant Verification Request
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
              <BiPhone className="text-lg" />
            </div>

            <div>
              <p className="text-xs text-gray-400">Phone Number</p>
              <p className="text-sm font-medium text-gray-700">
                {restaurant.phone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
              <BiMap className="text-lg" />
            </div>

            <div>
              <p className="text-xs text-gray-400">Location</p>

              <p className="text-sm leading-relaxed text-gray-700">
                {restaurant.autoLocation?.formattedAddress}
              </p>
            </div>
          </div>
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-600"
          onClick={verify}
        >
          <BiCheckShield className="text-lg" />
          Verify Restaurant
        </button>
      </div>
    </div>
  );
};

export default AdminRestaurantCard;
