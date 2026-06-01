import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useAppData } from "../context/AppContext";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const { setUser, setIsAuth } = useAppData();

  const navigate = useNavigate(); //ask

  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(`${authService}/api/auth/login`, {
        code: authResult["code"],
      });

      localStorage.setItem("token", result.data.token);

      toast.success(result.data.message);
      setLoading(false);
      setUser(result.data.user);
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Problem while loading");
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-red-100 px-4">
      <div className="w-full max-w-sm space-y-7 rounded-3xl border border-white/40 bg-white/70 p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-[0_25px_80px_rgba(226,55,116,0.35)]">
        <h1 className="text-center text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] bg-clip-text text-transparent drop-shadow-sm">
          Feastly
        </h1>
        <p className="text-center text-sm text-gray-500">
          Log in or sign up to continue
        </p>
        <button
          onClick={googleLogin}
          disabled={loading}
          className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 font-medium text-gray-700 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#E23774]/40 active:scale-[0.98]"
        >
          <FcGoogle size={20} />
          <span className="transition-colors duration-300 group-hover:text-[#E23774]">
            {loading ? "Signing in ..." : "Continue with Google"}
          </span>

          <span className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-[#FF512F]/10 via-[#E23774]/10 to-[#FF9966]/10"></span>
        </button>
        <p className="text-center text-xs text-gray-400 leading-relaxed">
          By continuing, you agree with our{" "}
          <span className="font-medium text-[#E23774] hover:underline cursor-pointer">
            Terms of Service
          </span>{" "}
          &{" "}
          <span className="font-medium text-[#E23774] hover:underline cursor-pointer">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
