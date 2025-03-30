import { useState } from "react";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    city:"",
    locality:"",
    state:"",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 500,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    phone:"",
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filePerc, setFilePerc] = useState(0);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError("Image successfully uploaded!");
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setFilePerc(Math.round(progress));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    
    <div class="flex items-center justify-center min-h-screen">
    <div
      class="relative flex flex-col m-2 sm:m-4  sm:pr-20 sm:pl-20 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0"
    >
     <main className="p-3 max-w-4xl mx-auto">

     <h1 className="text-4xl font-bold text-center my-7 text-gray-800">
  <span className="text-red-500">Create</span> Listing
</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-20 "
      >
        <div className="flex flex-col gap-2 flex-1">
          <input
            type="text"
            placeholder="Flat type or name"
            className="border capitalize p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="3"
            required
            onChange={handleChange}
            value={formData.name}
          />
          
          <textarea
            type="text"
            placeholder="Description"
            className="border  p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
           <input
            type="text"
            placeholder="City"
            className="border capitalize p-3 rounded-lg"
            id="city"
            required
            onChange={handleChange}
            value={formData.city}
          />
           <input
            type="text"
            placeholder="Locality"
            className="border capitalize p-3 rounded-lg"
            id="locality"
            required
            onChange={handleChange}
            value={formData.locality}
          />
           <input
            type="text"
            placeholder="State"
            className="border capitalize p-3 rounded-lg"
            id="state"
            required
            onChange={handleChange}
            value={formData.state}
          />
          <textarea
            type="text"
            placeholder="Complete address"
            className="border capitalize p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <hr className="mt-4 mb-2" />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Bedroom</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Bathroom</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="500"
                max="10000000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">
                    ( <b>₹</b> / month)
                  </span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>

                  {formData.type === "rent" && (
                    <span className="text-xs">
                      ( <b>₹</b>/ month)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <hr className="mt-4 mb-2" />
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold mx-2 text-gray-800">Note:</p>
          <marquee behavior="scroll" direction="up" scrollamount="3">
            <div className="font-semibold ">
              <div className="font-normal text-gray-600 ml-2">
                <div className="font-semibold">
                  I.{" "}
                  <span className="font-normal">
                    The first image will be the cover image.
                  </span>
                </div>
                <div className="font-semibold">
                  II.{" "}
                  <span className="font-normal">
                    You can upload a maximum of 6 pictures.
                  </span>
                </div>
                <div className="font-semibold">
                  III.{" "}
                  <span className="font-normal">
                    Each picture should have a maximum size of 2MB.
                  </span>
                </div>
              </div>
            </div>
          </marquee>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded  hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <p className="text-sm self-center">
            {imageUploadError ? (
              imageUploadError == "Image successfully uploaded!" ? (
                <span className="text-green-700">{imageUploadError}</span>
              ) : (
                <span className="text-red-700">{imageUploadError}</span>
              )
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading images:${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-purple-700 text-sm">wait..</span>
            ) : (
              ""
            )}
          </p>

          {/* <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p> */}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg  hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg  hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  </div>
  </div>
    
  );
}
