import { useState } from "react";
import { useAppData } from "../context/AppContext";
import { restaurantService } from "../main";
import axios from "axios";
import toast from "react-hot-toast";
import { BiMapPin, BiUpload } from "react-icons/bi";

interface props {
  fetchMyRestaurant: () => Promise<void>;
}

const AddRestaurant = ({ fetchMyRestaurant }: props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { loadingLocation, location } = useAppData();

  const handleSubmit = async () => {
    if (!name || !image || !location) {
      alert("All field are required");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("latitude", String(location.latitude));
    formData.append("longitude", String(location.longitude));
    formData.append("formattedAddress", location.formattedAddress);
    formData.append("file", image);
    formData.append("phone", phone);

    try {
      setSubmitting(true);
      await axios.post(`${restaurantService}/api/restaurant/new`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Restaurant Added successfully");
      fetchMyRestaurant();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-100 px-4 py-10">
      <div className="mx-auto max-w-lg space-y-6 rounded-3xl border border-white/40 bg-white/70 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-[0_25px_80px_rgba(226,55,116,0.35)]">
        <h1 className="text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] bg-clip-text text-transparent">
          Add Your Restaurant
        </h1>
        <input
          type="text"
          placeholder="Restaurant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-white/40 bg-white/70 px-5 py-3 text-sm text-gray-700 shadow-sm outline-none backdrop-blur-md transition-all duration-300 placeholder:text-gray-400 focus:border-[#E23774]/50 focus:shadow-[0_0_25px_rgba(226,55,116,0.18)]"
        />
        <input
          type="number"
          placeholder="Contact Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-2xl border border-white/40 bg-white/70 px-5 py-3 text-sm text-gray-700 shadow-sm outline-none backdrop-blur-md transition-all duration-300 placeholder:text-gray-400 focus:border-[#E23774]/50 focus:shadow-[0_0_25px_rgba(226,55,116,0.18)]"
        />
        <textarea
          placeholder="Restaurant Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px] w-full rounded-2xl border border-white/40 bg-white/70 px-5 py-3 text-sm text-gray-700 shadow-sm outline-none backdrop-blur-md transition-all duration-300 placeholder:text-gray-400 focus:border-[#E23774]/50 focus:shadow-[0_0_25px_rgba(226,55,116,0.18)]"
        />
        <label className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#E23774]/30 bg-white/60 p-5 text-sm text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E23774]/60 hover:bg-white/80 hover:shadow-xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] shadow-md">
            <BiUpload className="h-5 w-5 text-white" />
          </div>

          <span className="font-medium group-hover:text-[#E23774] transition-colors duration-300">
            {image ? image.name : "Upload restaurant image"}
          </span>

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </label>
        <div className="flex items-start gap-4 rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] shadow-md">
            <BiMapPin className="h-5 w-5 text-white" />
          </div>

          <div className="text-sm leading-relaxed text-gray-700">
            {loadingLocation
              ? "Fetching your location..."
              : location?.formattedAddress || "Location not available"}
          </div>
        </div>
        <button
          className="w-full rounded-2xl bg-gradient-to-r from-[#FF512F] via-[#E23774] to-[#FF9966] py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(226,55,116,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Submitting..." : "Add Restaurant"}
        </button>
      </div>
    </div>
  );
};

export default AddRestaurant;
