import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, [auth]);

  const pathMatch = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };
  // console.log(location.pathname);
  return (
    <div className="p-3 bg-white border-b shadow-sm sticky top-0 z-40">
      <header className="flex justify-between items-center max-w-6xl mx-auto  md:px-3">
        <div>
          <Link to="/">
            <img
              className="h-5  cursor-pointer"
              src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
              alt="logo"
            />
          </Link>
        </div>

        <div>
          <ul className="flex space-x-8 ">
            <Link to="/">
              <li
                className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
              ${pathMatch("/") && "text-black border-b-red-500"}`}
              >
                Home
              </li>
            </Link>

            <Link to="/offers">
              <li
                className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
              ${pathMatch("/offers") && "text-black border-b-red-500"}`}
              >
                Offers
              </li>
            </Link>
            {loggedIn ? (
              <li
                className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
              ${
                (pathMatch("/profile") || pathMatch("/profile")) &&
                "text-black border-b-red-500"
              }`}
                onClick={() => navigate("/profile")}
              >
                Profile
              </li>
            ) : (
              <li
                className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
              ${
                (pathMatch("/sign-in") || pathMatch("/sign-in")) &&
                "text-black border-b-red-500"
              }`}
                onClick={() => navigate("/sign-in")}
              >
                Sign in
              </li>
            )}
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
