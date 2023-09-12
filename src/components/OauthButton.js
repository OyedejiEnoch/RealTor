import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const OauthButton = () => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // to firstly check if the user exist in the database
      const docRef = doc(db, "users", user.uid);

      const docSnap = await getDoc(docRef);

      // if the user doesn't exist then set it or add to the database
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      toast.success("Signed in Successfully");
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with google");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center gap-1 w-full bg-red-700 rounded text-white py-3 px-7 font-medium
    hover:bg-red-800 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
    >
      <FcGoogle fontSize={20} className="bg-white rounded-full mr-1" /> Continue
      with Google
    </button>
  );
};

export default OauthButton;
