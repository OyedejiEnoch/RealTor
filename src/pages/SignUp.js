import React, { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import OauthButton from "../components/OauthButton";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const SignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const user = userCredentials.user;

      const formDataCopy = { ...formData };

      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      // adding a timestamp field

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      // we save the new user to a database,
      // we are telling which database it should add to(db), the name of our collection (users), and what to add i.e the usersId

      toast.success("Sign Up Successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section>
      <h1 className="text-3xl text-center mt-3 font-semibold">Sign Up</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto lg:gap-12">
        {/* imageDiv */}
        <div className="md:w-[67%] lg:w-[50%] md:mb-6 mb-12 ">
          <img
            src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb3BlcnR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
            alt="image"
            className="w-full rounded-2xl"
          />
        </div>

        {/* form div */}
        <div className="w-full md:w-[67%] lg:w-[40%] ">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Fullname"
              value={name}
              onChange={handleChange}
              className="w-full py-2 mb-6 px-4 text-sm text-gray-700 bg-white border-gray-300  rounded transition ease-in-out"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              className="w-full py-2 mb-6 px-4 text-sm text-gray-700 bg-white border-gray-300  rounded transition ease-in-out"
            />

            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : `password`}
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
                className="w-full mb-6 py-2 px-4 text-sm text-gray-700 bg-white border-gray-300 outline-none rounded transition ease-in-out"
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  fontSize={20}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 cursor-pointer"
                />
              ) : (
                <AiFillEye
                  fontSize={20}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 cursor-pointer"
                />
              )}
            </div>

            <div className="flex justify-between whitespace-nowrap text-sm md:text-[16px]">
              <div>
                <span className="text-gray-700">Have an account?</span>
                <Link to="/sign-in">
                  <span className="ml-2 text-red-600 hover:text-red-700 transition duration-200 ease-in-out cursor-pointer">
                    Sign In
                  </span>
                </Link>
              </div>
              <div>
                <Link to="/forgot-password">
                  <span className="text-blue-700 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer">
                    Forgot Password?
                  </span>
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-7 mt-3 rounded font-medium uppercase shadow-md 
            hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800"
            >
              {" "}
              Sign Up
            </button>

            <div
              className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 
          after:border-t after:flex-1 after:border-gray-300 "
            >
              <p className="text-center font-semibold mx-4">OR</p>
            </div>

            <OauthButton />
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
