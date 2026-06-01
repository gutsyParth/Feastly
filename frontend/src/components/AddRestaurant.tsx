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
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Add Your Restaurant
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Fill in the details to list your restaurant
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Restaurant Name
            </label>

            <input
              type="text"
              placeholder="Enter restaurant name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Contact Number
            </label>

            <input
              type="number"
              placeholder="Enter contact number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              placeholder="Write a short restaurant description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Restaurant Image
            </label>

            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-red-200 bg-red-50 px-4 py-5 transition hover:border-red-400 hover:bg-red-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-md">
                <BiUpload className="text-xl" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700">
                  {image ? image.name : "Choose image"}
                </span>

                <span className="text-xs text-gray-500">PNG, JPG or JPEG</span>
              </div>

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Restaurant Location
            </label>

            <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-sm">
                <BiMapPin className="text-xl" />
              </div>

              <div className="flex-1 text-sm leading-relaxed text-gray-700">
                {loadingLocation
                  ? "Fetching your location..."
                  : location?.formattedAddress || "Location not available"}
              </div>
            </div>
          </div>

          <button
            className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Submitting..." : "Add Restaurant"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurant;
