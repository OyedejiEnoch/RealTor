import React, { useState, useEffect } from "react";
import Slider from "../components/Slider";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
// import { toast } from "react-toastify";

const Home = () => {
  const [offersList, setOfferList] = useState(null);
  const [rentList, setRentList] = useState(null);
  const [saleList, setSaleList] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        // get the reference
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );

        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferList(listings);
        // console.log(listings);
      } catch (err) {
        // toast.error(err);
        console.log(err);
      }
    };
    fetchListing();
  }, []);

  // placed for rent
  useEffect(() => {
    const fetchListing = async () => {
      try {
        // get the reference
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );

        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentList(listings);
        // console.log(listings);
      } catch (err) {
        // toast.error(err);
        console.log(err);
      }
    };
    fetchListing();
  }, []);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        // get the reference
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );

        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleList(listings);
        // console.log(listings);
      } catch (err) {
        // toast.error(err);
        console.log(err);
      }
    };
    fetchListing();
  }, []);
  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto mt-5 space-y-6 pt-3">
        {offersList && offersList.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>
            <Link to="/offers">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more offers
              </p>
            </Link>

            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {offersList.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
        {/* rent */}
        {rentList && rentList.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">
              Places for rent
            </h2>
            <Link to="/rent">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for rent
              </p>
            </Link>

            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rentList.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
        {saleList && saleList.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">
              Places for Sale
            </h2>
            <Link to="/rent">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for Sle
              </p>
            </Link>

            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {saleList.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
