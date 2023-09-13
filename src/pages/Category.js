import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";
import {
  collection,
  query,
  orderBy,
  where,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { useParams } from "react-router-dom";

const Category = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(8)
        );

        // execute the query
        const querySnap = await getDocs(q);
        // const lastVisible = querySnap.docs[querySnap.doc.length - 1];
        // setLastFetched(lastVisible);
        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);

        setLoading(false);
      } catch (err) {
        toast.error("Could not fetch list");
      }
    };
    // console.log(listings);
    fetchListings();
  }, [params.categoryName]);

  // const handleFetchMore = async () => {
  //   try {
  //     const listingRef = collection(db, "listings");
  //     const q = query(
  //       listingRef,
  //       where("offer", "==", params.categoryName),
  //       orderBy("timestamp", "desc"),
  //       startAfter(lastFetched),
  //       limit(8)
  //     );

  //     // execute the query
  //     const querySnap = await getDocs(q);
  //     const lastVisible = querySnap.docs[querySnap.doc.length - 1];
  //     setLastFetched(lastVisible);
  //     const listings = [];

  //     querySnap.forEach((doc) => {
  //       return listings.push({
  //         id: doc.id,
  //         data: doc.data(),
  //       });
  //     });
  //     setListings((prevValue) => {
  //       return { ...prevValue, listings };
  //     });

  //     setLoading(false);
  //   } catch (err) {
  //     toast.error("Could not fetch list");
  //   }
  // };

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-2xl mt-6 text-center font-bold mb-6 ">
        {params.categoryName === "rent" ? "Places For Rent" : "Places For Sale"}
      </h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>
          {lastFetched && (
            <div className="flex justify-center items-center ">
              <button
                // onClick={handleFetchMore}
                className="bg-white px-3 py-1.5 text-gray-700 border-gray-300 mb-6 mt-6 rounded 
              "
              >
                Load more..
              </button>
            </div>
          )}
        </>
      ) : (
        <p>There are no current Category</p>
      )}
    </div>
  );
};

export default Category;
