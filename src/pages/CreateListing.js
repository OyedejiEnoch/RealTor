import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [geoLocation, setGeoLocation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    furnished,
    parking,
    address,
    description,
    offer,
    images,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
  } = formData;
  const onChange = (e) => {
    const { name, value, id, files } = e.target;
    let boolean = null;

    if (value === "true") {
      boolean = true;
    }
    if (value === "false") {
      boolean = false;
    }

    if (files) {
      setFormData((prevValue) => {
        return { ...prevValue, images: files };
      });
    }
    if (!files) {
      setFormData((prevValue) => {
        return { ...prevValue, [id]: boolean ?? value };
        // this boolean ?? value means if boolean is true set it to boolean else if value is true set it to value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price is more than the Regular price stated");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Number of Images exceeded max(6)");
      return;
    }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        // we are using the user id to see who uploaded the image

        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // toast.("Upload is " + progress + "% done");

            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
            switch (error.code) {
              case "storage/unauthorized":
                toast.error(
                  "User doesn't have permission to access the object"
                );
                break;
              case "storage/canceled":
                toast.error("Upload canceled");
                break;
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not Uploaded");
      return;

      // firstly we spreed all the images in a promise.all mapped through each one and returned each image into the
      // storeImage function as an argument then it uploads each image or perform the function in the storeImage
      // on each image passed and returns the image urls,
      // then the image urls returned becomes an array by the promise.all, into the constant imgUrls
    });

    // console.log(imgUrls);
    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
      // so here we spread the formdata and added the imgUrls and timestamp to it
    };

    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    // after all that we want to create a new collection, its like creating a new product collection and model
    // in the MERN stack, so we can then read all the data and imgUrl latter on into a ui
    setLoading(false);
    toast.success("Uploaded Successfully");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (loading) {
    return <Spinner />;
  }
  // since we are not fetching data on our screen first we can use our spinner here but on fetching data to any part of
  // the form we can set it as if loading ? <Spinner /> : (the particular code)
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-medium">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit}>
        <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
        <div className="flex items-center justify-center gap-5 flex-col md:flex-row">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={` w-full md:w-[50%] py-3 px-7 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
            active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }
            `}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={` w-full md:w-[50%] py-3 px-7 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
            active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }
            `}
          >
            Rent
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Property Name"
          maxLength={32}
          minLength={10}
          required
          className="border-none w-full px-4 py-2 rounded shadow-sm focus:shadow-lg text-[18px] text-gray-700 bg-white border
          border-gray-300 transition duration-150 ease-in-out focus:bg-white focus:border-slate-600
          "
        />

        <div className=" flex items-center gap-6 mt-6">
          <div className="">
            <p className="text-lg font-semibold "> Bedrooms </p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min={1}
              max={7}
              required
              className=" w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out
            focus:text-gray-700 focus:bg-white focus:border-slate-500
            "
            />
          </div>
          <div className="">
            <p className="text-lg font-semibold "> Bath </p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min={1}
              max={7}
              required
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out
            focus:text-gray-700 focus:bg-white focus:border-slate-500 text-center
            "
            />
          </div>
        </div>

        <p className="text-lg mt-6 font-semibold">Parking Spot</p>
        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={` w-full md:w-[50%] py-3 px-7 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
            active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out ${
              !parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }
            `}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={` w-full md:w-[50%] py-3 px-7 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
            active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out ${
              parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }
            `}
          >
            No
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={` w-full md:w-[50%] py-3 px-7 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
            active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out ${
              !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }
            `}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={` w-full md:w-[50%] py-3 px-7 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
            active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out ${
              furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }
            `}
          >
            No
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          className="border-none w-full px-4 py-2 rounded shadow-sm focus:shadow-lg text-[18px] text-gray-700 bg-white border
          border-gray-300 transition duration-150 ease-in-out focus:bg-white focus:border-slate-600
          "
        />
        {!geoLocation && (
          <div className="flex space-x-6 justify-start mb-6 mt-2">
            <div>
              <p className="text-lg font-semibold ">Latitude</p>
              <input
                className="w-full px-4 py-2 text-lg text-gray-700 text-center border border-gray-300 bg-white rounded
                transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-700"
                type="number"
                id="latitude"
                value={latitude}
                min="-90"
                max="90"
                onChange={onChange}
                required
              />
            </div>
            <div>
              <p className="text-lg font-semibold ">longitude</p>
              <input
                className="w-full px-4 py-2 text-lg text-gray-700 text-center border border-gray-300 bg-white rounded
                transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-700"
                type="number"
                id="longitude"
                value={longitude}
                min="-180"
                max="180"
                onChange={onChange}
                required
              />
            </div>
          </div>
        )}
        <p className="text-lg mt-6 font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          className="border-none w-full px-4 py-2 rounded shadow-sm focus:shadow-lg text-[18px] text-gray-700 bg-white border
          border-gray-300 transition duration-150 ease-in-out focus:bg-white focus:border-slate-600
          "
        />

        <p className="text-lg mt-6 font-semibold">Offer</p>
        <div className="flex items-center justify-center gap-5 mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={` w-full md:w-[50%] py-3 px-7 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
            active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out ${
              !offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }
            `}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={` w-full md:w-[50%] py-3 px-7 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
            active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out ${
              offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }
            `}
          >
            No
          </button>
        </div>

        <div className="mb-6 flex">
          <div className="">
            <p className="text-lg font-semibold ">Regular Price</p>
            <div className="flex items-center gap-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max={"400000000"}
                required
                className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150
                ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />

              {type === "rent" && (
                <div className="w-full">
                  <p className="text-md w-full"> $/Month</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {offer && (
          <div className="mb-6 flex">
            <div className="">
              <p className="text-lg font-semibold ">Discounted Price</p>
              <div className="flex items-center gap-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max={"400000000"}
                  required={offer}
                  className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150
                ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                />

                {type === "rent" && (
                  <div className="w-full">
                    <p className="text-md w-full"> $/Month</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <p className="text-lg font-semibold ">Images</p>
          <p className="text-gray-500 mb-3">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg, .png, .jpeg"
            multiple
            required
            className="w-full bg-white py-1.5 px-3 text-gray-700 border border-gray-200 rounded transition duration-150 ease-in-out
            focus:border-slate-400
            "
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 w-full mb-6 px-7 py-3 text-white font-medium rounded text-sm uppercase shadow-md
          hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg transition duration-150 ease-in-out
          active:bg-blue-800
          "
        >
          Create
        </button>
      </form>
    </main>
  );
};

export default CreateListing;

// let geoLocation = {};
// let location;
// if (geoLocation) {
//   const response = await fetch(``);
//   const data = await response.json();
//   // fetch the written address using geo code google api,
//   // then set the response into a json format in the data variable
//   console.log();

//   geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0;
//   geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0;
//   // tap into the json format gotten and two new objects the lat and lng

//   location = data.status === "ZERO_RESULTS" && undefined;
//   if (location === undefined || location.includes("undefined")) {
//     setLoading(false);
//     toast.error("Do Enter a Correct address");
//     return;
//   }
// } else {
//   geoLocation.lat = latitude;
//   geoLocation.lat = longitude;
// }
