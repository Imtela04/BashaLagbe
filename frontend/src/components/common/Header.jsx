import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Img from "../assets/black_bg.png";

const Header = () => {
  const navigate = useNavigate();

  function checkUserLoggedIn() {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if token exists, false otherwise
  }

  const userLoggedIn = checkUserLoggedIn();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  const isAdmin = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).isAdmin
    : "";

  return (
    <nav className="bg-zinc-950">
     
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between h-16">
         
          <div className="flex flex-row gap-2 items-center">
            
            <div className="flex-shrink-0">
              <Link to = '/'>
                <img className="h-24 w-auto" src={Img} alt="Your Company" />
              </Link>
            </div>
            
            {/* Links */}
            

          </div>


          <div className="flex items-center space-x-4">
            {!userLoggedIn ? (
              <Link
                to="/login"
                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                Login
              </Link>
            ) : (

              <div className="flex space-x-4">
                

                <Link
                  to="/admin"  //admin dashboard
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  {isAdmin ? "Dashboard" : ""}
                </Link>

                <Link
                  to="/customer"  //customer dashboard
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  {isAdmin ? "" : "Dashboard"}
                </Link>
                <Link
                  onClick={handleLogout}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  Logout
                </Link>
                <Link
                  to="/changepass"
                  className="hidden sm:inline text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  Change Password
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
