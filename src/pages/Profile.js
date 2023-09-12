import { getAuth, updateProfile } from "firebase/auth";
import React, { useState, useEffect } from "react";
import ListingItem from "../components/ListingItem";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FcHome } from "react-icons/fc";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const Profile = () => {
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState();
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  // to fetch the logged in user data and load on the site, i.e like getting the user data from the state
  const [profile, setProfile] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = profile;

  const handleChange = (e) => {
    const { name, value, id } = e.target;

    setProfile((prevValue) => {
      return { ...prevValue, [id]: value };
    });
  };

  const handleClick = () => {
    auth.signOut();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update the name in the firestore i.e database

        const docRef = doc(db, "users", auth.currentUser.uid);
        // it collects 3 things the db, collection name, and ID
        // now we want to update in the database also, so we create our docRef i.e the database we are updating, the collection name
        // and the id of what we are updating

        await updateDoc(docRef, {
          name: name,
        });
        // then finally we update the doc using the updateDoc providing the details of the doc and what we want to update
      }

      toast.success("Updated Successfully");
    } catch (error) {
      toast.error("Could not Update Profile");
    }
  };

  useEffect(() => {
    async function fetchUserListing() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      // this is like a normal query in Mongo

        // note the userRef can have lots of things posted to thr listing collection there, check through the listing
        // collection and then get the listings that has a userRef that is equal to the currentUser.uid
      );
      // we are trying to fetch the data where the userRef is equal to the currentUser.uid and also
      // we are checking the listings collection where the userRef that we created as a variable to sore the uid,
      // if it is equal to the currentUser.uid and we are trying to order what we are fetching by the timestamp in
      // in descending order

      const querySnap = await getDocs(q);
      let listings = [];

      // console.log(querySnap);
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      // i.e for each snapShot i.e for each listings collection get only the id and the data because the snapShot return
      // a lot of unnecessary info, there get only the id and data then push as an object into the listings array

      setListings(listings);
      setLoading(false);
    }
    fetchUserListing();
  }, [auth.currentUser.uid]);

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      // firstly delete from the document
      await deleteDoc(doc(db, "listings", id));
      // then delete from the ui
      const updatedListing = listings.filter((listing) => listing.id !== id);

      setListings(updatedListing);
      toast.success("Successfully Deleted");
    }
  };
  const onEdit = (id) => {
    navigate(`/edit-listing/${id}`);
  };

  // console.log(listings);

  return (
    <>
      <section className="max-w-6xl mx-auto flex items-center justify-center flex-col">
        <h1 className="text-center text-3xl mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3 ">
          <form>
            <input
              className={`w-full py-2 text-[16px] cursor-pointer px-4 mb-4  text-gray-800 bg-white outline-none border-gray-300 rounded 
              transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
              type="text"
              id="name"
              value={name}
              onChange={handleChange}
              disabled={!changeDetail}
            />
            <input
              className="w-full py-2 px-4 mb-4  text-[16px] cursor-pointer text-gray-800 bg-white outline-none border-gray-300 rounded 
              transition ease-in-out
              "
              type="email"
              id="email"
              onChange={handleChange}
              value={email}
            />
          </form>

          <div className="flex items-center justify-between whitespace-nowrap text-sm sm:text-[16px] mb-6 ">
            <p>
              Do you want to change your name?{" "}
              <span
                onClick={() => {
                  changeDetail && handleSubmit();
                  setChangeDetail((prevValue) => !prevValue);
                }}
                className="ml-1 text-red-600 hover:text-red-700 transition duration-200 ease-in-out  cursor-pointer font-semibold"
              >
                {changeDetail ? "Apply Change" : "Edit"}
              </span>
            </p>

            <p
              onClick={handleClick}
              className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer "
            >
              Sign Out
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 rounded text-white px-7 py-3 font-medium uppercase shadow-md hover:bg-blue-700
            transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800
            "
          >
            <Link
              to="/create-listing"
              className="flex w-full justify-center items-center gap-3"
            >
              {" "}
              <FcHome className="text-[30px] bg-red-200 rounded-full p-1" />{" "}
              Sell or Rent your Home
            </Link>
          </button>
        </div>
      </section>

      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-center text-xl font-semibold mb-6">
              My Listings
            </h2>
            <ul className="mt-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;

// if i was doing this using the MERN stack instead, i would create an update controller from the backend
// where we can update,
// so firstly on coming to the profile page we can firstly fetch all the user data and display on the screen i.e adding
// the fetched data,s to the value
// then we create our state change where users can update the inputs of the profile and finally send the data using the
// update api from our controller we created
