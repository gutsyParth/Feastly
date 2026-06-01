import axios from "axios";
import toast from "react-hot-toast";
import { adminService } from "../main";
import {
  BiBadgeCheck,
  BiCreditCard,
  BiIdCard,
  BiPhone,
  BiUser,
} from "react-icons/bi";

const RiderAdmin = ({
  rider,
  onVerify,
}: {
  rider: any;
  onVerify: () => void;
}) => {
  const verify = async () => {
    try {
      await axios.patch(
        `${adminService}/api/v1/verify/rider/${rider._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Rider verified");
      onVerify();
    } catch (error) {
      toast.error("failed to verify rider");
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-60 overflow-hidden">
        <img
          src={rider.picture}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
          alt=""
        />

        <div className="absolute right-4 top-4 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 shadow">
          Pending Verification
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <BiUser className="text-red-500" />
            Delivery Rider
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Rider Verification Request
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-500">
              <BiPhone className="text-lg" />
            </div>

            <div>
              <p className="text-xs text-gray-400">Phone Number</p>

              <p className="text-sm font-semibold text-gray-700">
                {rider.phoneNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-500">
              <BiIdCard className="text-lg" />
            </div>

            <div>
              <p className="text-xs text-gray-400">Aadhaar Number</p>

              <p className="text-sm font-semibold text-gray-700">
                {rider.aadhaarNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-500">
              <BiCreditCard className="text-lg" />
            </div>

            <div>
              <p className="text-xs text-gray-400">Driving License</p>

              <p className="text-sm font-semibold text-gray-700">
                {rider.drivingLicenseNumber}
              </p>
            </div>
          </div>
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-600"
          onClick={verify}
        >
          <BiBadgeCheck className="text-lg" />
          Verify Rider
        </button>
      </div>
    </div>
  );
};

export default RiderAdmin;
