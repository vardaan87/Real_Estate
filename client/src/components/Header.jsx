import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import {
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const closeSidebar = () => {
    setShowSidebar(false);
    document.body.classList.remove('overflow-hidden');
  };

  const openSidebar = () => {
    setShowSidebar(true);
    document.body.classList.add('overflow-hidden');
  };

  const dispatch = useDispatch();

  const handleChange = () => {
    if (!currentUser) {
      toast.info("Please log in first");
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        toast.error("Sign out failed")
        dispatch(deleteUserFailure(data.message));
        return;
      }
      toast.success("Logged Out Successfully!");
      dispatch(deleteUserSuccess(data));
      closeSidebar();
    } catch (error) {
      toast.error("something went wrong")
      dispatch(deleteUserFailure(data.message));
    }
  };

  return (
    <header className="shadow-md bg-slate-200">
      <div className="flex items-center justify-between max-w-6xl p-4 mx-auto">
        <Link to="/" onClick={closeSidebar}>
          <h1 className="flex-wrap text-sm font-bold sm:text-xl">
            <span style={{ color: '#ff0000' }}>Trendy</span>
            <span className="text-slate-700">Homes</span>
          </h1>
        </Link>

        <button
          className="sm:hidden focus:outline-none"
          onClick={showSidebar ? closeSidebar : openSidebar}
        >
          {showSidebar ? <FaTimes className="text-slate-700" /> : <FaBars className="text-slate-700" />}
        </button>

        {showSidebar && (
          <div ref={sidebarRef} className="sm:hidden absolute right-0 top-0 h-full bg-white w-[220px] z-30 shadow-md">
            {!currentUser && (
              <div className='mt-5'>

              </div>
            )}
            <button className="absolute top-4 right-4 text-gray-700" onClick={closeSidebar}>
              <FaTimes />
            </button>
            <ul className="flex flex-col gap-4 p-4">
              <li className="text-gray-700 hover:underline">
                <Link to="/profile" onClick={closeSidebar}>
                  {currentUser ? (
                    <div className="flex items-center gap-3">
                      <img
                        className="rounded-full h-12 w-12 object-cover"
                        src={currentUser.avatar}
                        alt="profile"
                      />
                      <span className="text-gray-700">{currentUser.username}</span>
                    </div>
                  ) : (
                    <span >Log In</span>
                  )}
                </Link>
              </li>
              <li className="text-gray-700 hover:underline">
                <Link to="/" onClick={closeSidebar}>
                  Home
                </Link>
              </li>
              <li className="text-gray-700 hover:underline">
                <Link to={"/profile"} onClick={closeSidebar}>
                  My Profile
                </Link>
              </li>
              <li className="text-green-600 hover:underline">
                <Link to={"/create-listing"} onClick={closeSidebar}>
                  Create Listing
                </Link>
              </li>
              <li className="text-gray-700 hover:underline">
                <Link to="/showlisting" onClick={closeSidebar}>
                  My Listings
                </Link>
              </li>

              <li className="text-gray-700 hover:underline">
                <Link to="/about" onClick={closeSidebar}>
                  About us
                </Link>
              </li>
           { currentUser? ( <li>
                <button
                  onClick={handleSignOut}
                  style={{color:'#ff0000'}}
                  className=" hover:underline focus:outline-none"
                >
                  Log out
                </button>
              </li>):(null)}
              <div className='text-sm absolute bottom-5'>
    version-3.0.1
  </div>
            </ul>
          </div>
        )}

        <ul className="hidden sm:flex gap-10">
          <li className="text-gray-700 hover:underline">
            <Link to="/" onClick={closeSidebar}>Home</Link>
          </li>
          <li className="text-gray-700 hover:underline">
            <Link to="/about" onClick={closeSidebar}>About </Link>
          </li>
          <Link
            onClick={handleChange}
            style={{ color: '#ff0000' }}
            className="   px-2 rounded-md text-center hover:opacity-90"
            to={"/create-listing"}
          >
            Create Listing
          </Link>

          <li>
            <Link to="/profile" onClick={closeSidebar}>
              {currentUser ? (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <span className='text-gray-700'>Log in</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
