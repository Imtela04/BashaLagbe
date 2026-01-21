import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Img from "../assets/black_bg.png";

const Header = () => {
  const navigate = useNavigate();
  const [showAccommodationMenu, setShowAccommodationMenu] = useState(false);

  function checkUserLoggedIn() {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if token exists, false otherwise
  }

  const userLoggedIn = checkUserLoggedIn();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    // Force a page reload to clear all state
    window.location.reload();
  };

  const isAdmin = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).isAdmin
    : "";

  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : "";

  const userType = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).userType
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
            <div>
              <Link to='/about'>
                <li className='text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'>
                  About
                </li>
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

                {userType === 'landlord' && (
                  <div className="relative">
                    <button
                      onClick={() => setShowAccommodationMenu(!showAccommodationMenu)}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium flex items-center gap-1"
                    >
                      Accommodations
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showAccommodationMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
                        <Link
                          to="/post-accommodation"
                          onClick={() => setShowAccommodationMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                        >
                          + Post Accommodation
                        </Link>
                        <Link
                          to="/my-accommodations"
                          onClick={() => setShowAccommodationMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Accommodations
                        </Link>
                        <Link
                          to="/manage-bids"
                          onClick={() => setShowAccommodationMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
                        >
                          Manage Bids
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <Link
                  to="/profile/edit"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  My Profile
                </Link>

                <Link
                  to={userType === 'landlord' ? `/profile/landlord/${userId}` : userType === 'roommate' ? `/profile/roommate/${userId}` : '/profile/edit'}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  View Profile
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
