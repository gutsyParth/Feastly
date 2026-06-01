import { CgShoppingCart } from "react-icons/cg";
import { useAppData } from "../context/AppContext";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { BiMapPin, BiSearch } from "react-icons/bi";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { isAuth, city, quantity } = useAppData();
  const currLocation = useLocation();

  const isHomePage = currLocation.pathname === "/";

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        setSearchParams({ search });
      } else {
        setSearchParams({});
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent"
        >
          Feastly
        </Link>

        <div className="flex items-center gap-5">
          <Link
            to="/cart"
            className="group relative rounded-full bg-red-50 p-2 transition hover:bg-red-100"
          >
            <CgShoppingCart className="h-7 w-7 text-red-500 transition group-hover:scale-110" />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
              {quantity}
            </span>
          </Link>

          {isAuth ? (
            <Link
              to="/account"
              className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-100"
            >
              Account
            </Link>
          ) : (
            <Link
              to="/Login"
              className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {isHomePage && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm md:flex-row md:items-center">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm md:min-w-[240px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
                <BiMapPin className="h-5 w-5" />
              </div>

              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Location
                </span>

                <span className="truncate text-sm font-semibold text-gray-700">
                  {city}
                </span>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition focus-within:ring-2 focus-within:ring-red-100">
              <BiSearch className="h-5 w-5 text-gray-400" />

              <input
                type="text"
                placeholder="Search for restaurants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
