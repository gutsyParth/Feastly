import { useAppData } from "../context/AppContext";
import { Navigate, Outlet } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";

const PublicRoute = () => {
  const { isAuth, loading } = useAppData();

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
              Preparing your experience
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuth ? (
        <Navigate to="/" replace />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
          <Outlet />
        </div>
      )}
    </>
  );
};

export default PublicRoute;
