import { useState } from "react";
import { restaurantService } from "../main";
import axios from "axios";
import toast from "react-hot-toast";
import { BiUpload } from "react-icons/bi";

const AddMenuItem = ({ onItemAdded }: { onItemAdded: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!name || !price || !image) {
      alert("Name, price and image is required");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("file", image);

    try {
      setLoading(true);
      await axios.post(`${restaurantService}/api/item/new`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Item added successfully");
      resetForm();
      onItemAdded();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-4 m-auto">
      <h2 className="text-lg font-semibold">Add Menu Item</h2>
      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
      />
      <textarea
        placeholder="Item description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
      />
      <input
        type="number"
        placeholder="price ₹"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
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

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full rounded-lg text-white text-sm py-3 font-semibold transition bg-red-500"
      >
        {loading ? "Adding..." : "Add Item"}
      </button>
    </div>
  );
};

export default AddMenuItem;
