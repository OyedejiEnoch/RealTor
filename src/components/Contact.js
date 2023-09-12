import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

const Contact = ({ userRef, listing }) => {
  const [landLord, setLandLord] = useState();
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getLandLord() {
      const docRef = doc(db, "users", userRef);
      // get the user doc with that particular id
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandLord(docSnap.data());
      } else {
        toast.error("Could not get user data");
      }
      console.log(landLord);
    }
    getLandLord();
  }, [userRef]);
  return (
    <>
      {landLord && (
        <div className="flex flex-col w-full ">
          <p className="">
            Contact the <span className="font-semibold">{landLord.name} </span>
            for the{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <div className="mt-3 mb-4">
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150
              ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 "
            />
          </div>
          <a
            href={`mailto:${landLord.email}?subject=${listing.name}&body=${message}`}
          >
            <button
              className="px-7 py-3 rounded bg-blue-600 text-white shadow-md hover:bg-blue-700 
            hover:shadow-lg uppercase text-sm focus:bg-blue-700 active:bg-blue-800 transition duration-150 ease-in-out 
            w-full font-bold"
              type="button"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
};

export default Contact;
