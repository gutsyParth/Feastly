import axios from "axios";
import { useState } from "react";
import { useAppData } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../main";

type Role = "customer" | "rider" | "seller" | null;

const SelectRole = () => {
  const [role, setRole] = useState<Role>(null);

  const { setUser } = useAppData();
  const navigate = useNavigate();

  const roles: Role[] = ["customer", "rider", "seller"];

  const addRole = async () => {
    try {
      const { data } = await axios.put(
        `${authService}/api/auth/add/role`,
        {
          role,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/", { replace: true });
    } catch (error) {
      alert("something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-red-100 px-4">
      <div className="w-full max-w-sm space-y-7 rounded-3xl border border-white/40 bg-white/70 p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-[0_25px_80px_rgba(226,55,116,0.35)]">
        <h1 className="text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] bg-clip-text text-transparent">
          Choose your role
        </h1>
        <div className="space-y-4">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`group relative w-full rounded-2xl border px-5 py-3 text-sm font-medium capitalize shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                role === r
                  ? "border-[#E23774] bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#E23774]/40"
              }`}
            >
              Continue as {r}
              <span className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-[#FF512F]/10 via-[#E23774]/10 to-[#FF9966]/10"></span>
            </button>
          ))}
        </div>
        <button
          disabled={!role}
          onClick={addRole}
          className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold shadow-md transition-all duration-300 ${
            role
              ? "bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] text-white hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SelectRole;
