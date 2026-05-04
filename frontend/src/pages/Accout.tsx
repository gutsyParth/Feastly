import toast from "react-hot-toast";
import { BiLogOut, BiMapPin, BiPackage } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppContext";

const Account = () => {
  const { user, setUser, setIsAuth } = useAppData();

  const firstLetter = user?.name.charAt(0).toUpperCase();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.setItem("token", "");
    setUser(null);
    setIsAuth(false);
    navigate("/login");
    toast.success("Logout Success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-100 px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-[0_25px_80px_rgba(226,55,116,0.35)]">
        <div className="flex items-center gap-4 border-b border-white/40 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] text-xl font-semibold text-white shadow-md">
            {firstLetter}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="divide-y divide-white/30">
          <div
            className="group flex cursor-pointer items-center gap-4 p-6 transition-all duration-300 hover:bg-white/60 hover:-translate-y-0.5"
            onClick={() => navigate("/orders")}
          >
            <BiPackage className="h-5 w-5 text-[#E23774] transition-transform duration-300 group-hover:scale-110" />
            <span className="font-medium text-gray-700 group-hover:text-[#E23774]">
              Your Orders
            </span>
          </div>

          <div
            className="group flex cursor-pointer items-center gap-4 p-6 transition-all duration-300 hover:bg-white/60 hover:-translate-y-0.5"
            onClick={() => navigate("/address")}
          >
            <BiMapPin className="h-5 w-5 text-[#E23774] transition-transform duration-300 group-hover:scale-110" />
            <span className="font-medium text-gray-700 group-hover:text-[#E23774]">
              Addresses
            </span>
          </div>

          <div
            className="group flex cursor-pointer items-center gap-4 p-6 transition-all duration-300 hover:bg-white/60 hover:-translate-y-0.5"
            onClick={logoutHandler}
          >
            <BiLogOut className="h-5 w-5 text-[#E23774] transition-transform duration-300 group-hover:scale-110" />
            <span className="font-medium text-gray-700 group-hover:text-[#E23774]">
              Logout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
