import React, { useState } from "react";
import { Link } from "react-router-dom";
import OauthButton from "../components/OauthButton";
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);

      toast.success("Email was sent");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <section>
      <h1 className="text-3xl text-center mt-3 font-semibold">
        Forgot Password
      </h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto lg:gap-12">
        {/* imageDiv */}
        <div className="md:w-[67%] lg:w-[50%] md:mb-6 mb-12 ">
          <img
            src="https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="image"
            className="w-full rounded-2xl"
          />
        </div>

        {/* form div */}
        <div className="w-full md:w-[67%] lg:w-[40%] ">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              className="w-full py-2 mb-6 px-4 text-sm text-gray-700 bg-white border-gray-300  rounded transition ease-in-out"
            />

            <div className="flex justify-between whitespace-nowrap text-sm md:text-[16px]">
              <div>
                <span className="text-gray-700">Don't have an account?</span>
                <Link to="/sign-up">
                  <span className="ml-2 text-red-600 hover:text-red-700 transition duration-200 ease-in-out cursor-pointer">
                    Register
                  </span>
                </Link>
              </div>
              <div>
                <Link to="/sign-in">
                  <span className="text-blue-700 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer">
                    Sign In
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
              Send reset password
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

export default ForgotPassword;
