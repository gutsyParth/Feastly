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
    <div className="w-full bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] bg-clip-text text-transparent cursor-pointer"
        >
          Feastly
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/cart" className="relative group">
            <CgShoppingCart className="h-7 w-7 text-[#E23774] transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] text-xs font-semibold text-white shadow-md">
              {quantity}
            </span>
          </Link>

          {isAuth ? (
            <Link
              to="/account"
              className="font-semibold text-[#E23774] transition-all duration-300 hover:text-[#FF512F] hover:underline underline-offset-4"
            >
              Account
            </Link>
          ) : (
            <Link
              to="/Login"
              className="font-semibold text-[#E23774] transition-all duration-300 hover:text-[#FF512F] hover:underline underline-offset-4"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      {isHomePage && (
        <div className="border-t border-white/30 px-4 py-4 bg-white/50 backdrop-blur-lg">
          <div className="mx-auto flex max-w-7xl items-center rounded-2xl border border-white/40 bg-white/70 shadow-lg backdrop-blur-xl transition-all duration-300 focus-within:shadow-[0_10px_40px_rgba(226,55,116,0.25)]">
            <div className="flex items-center gap-2 px-4 border-r border-gray-200 text-gray-700">
              <BiMapPin className="h-5 w-5 text-[#E23774]" />
              <span className="text-sm truncate max-w-36 font-medium">
                {city}
              </span>
            </div>

            <div className="flex flex-1 items-center gap-3 px-4">
              <BiSearch className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for restaurant"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3 text-sm bg-transparent outline-none placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
