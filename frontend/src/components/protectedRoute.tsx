import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import { BiLoaderAlt } from "react-icons/bi";

const ProtectedRoute = () => {
  const { isAuth, user, loading } = useAppData();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-white px-10 py-8 shadow-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <BiLoaderAlt className="animate-spin text-3xl text-red-500" />
          </div>

          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800">Loading</h2>

            <p className="mt-1 text-sm text-gray-500">
              Please wait while we verify your session
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to={"/login"} replace />;
  }

  if (user?.role === null && location.pathname !== "/select-role") {
    return <Navigate to={"/select-role"} replace />;
  }

  if (user?.role !== null && location.pathname === "/select-role") {
    return <Navigate to={"/"} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;
