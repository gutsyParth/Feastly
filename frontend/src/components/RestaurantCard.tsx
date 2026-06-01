import { useNavigate } from "react-router-dom";
import { BiMapPin, BiTimeFive } from "react-icons/bi";

type props = {
  id: string;
  name: string;
  image: string;
  distance: string;
  isOpen: boolean;
};

const RestaurantCard = ({ id, name, image, distance, isOpen }: props) => {
  const navigate = useNavigate();

  return (
    <div
      className={`group cursor-pointer overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
        !isOpen ? "opacity-90" : ""
      }`}
      onClick={() => navigate(`/restaurant/${id}`)}
    >
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={image}
          alt=""
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-110 ${
            !isOpen ? "grayscale brightness-75" : ""
          }`}
        />

        <div className="absolute left-4 top-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold shadow-md ${
              isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {isOpen ? "Open Now" : "Closed"}
          </span>
        </div>

        {!isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="rounded-2xl bg-white/90 px-5 py-3 text-sm font-bold text-gray-800 shadow-lg backdrop-blur-sm">
              Currently Closed
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="truncate text-xl font-bold text-gray-800">{name}</h3>

          <p className="mt-1 text-sm text-gray-500">
            Delicious food delivered fast
          </p>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BiMapPin className="text-lg text-red-500" />
            <span>{distance} km away</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BiTimeFive className="text-lg text-orange-500" />
            <span>25-30 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
