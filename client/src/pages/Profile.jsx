import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {toast} from 'react-toastify'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";


import Footer from "../components/Footer";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const dispatch = useDispatch();
  const [deleteListingId, setDeleteListingId] = useState(null);

 
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    setFileUploadError(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setFilePerc(Math.round(progress));
      },

      (error) => {
        setFileUploadError("Error Image upload (image must be less than 2 mb)");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileUploadError("Image successfully uploaded!");
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error("Failed to update user profile!");
        dispatch(updateUserFailure(data.message));
        return;
      }
       toast.success("Profile updated successfully")
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setEditMode(false);
    } catch (error) {
      toast.error("Something went wrong");
      dispatch(updateUserFailure(error.message));
    }
  };
  const openDeleteConfirmation = (currentUser)=> {
    setDeleteListingId(currentUser);
  };

  const closeDeleteConfirmation = () => {
    setDeleteListingId(null);
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error("Failed to delete account");
        dispatch(deleteUserFailure(data.message));
        return;
      }
      toast.success('Account deleted successfully');
      setDeleteListingId(null);
      dispatch(deleteUserSuccess(data));
     
    } catch (error) {
      toast.error("Error deleting account");
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        toast.error("failed to Log out")
        dispatch(deleteUserFailure(data.message));

        return;
      }
      toast.success("Logged Out Successfully!");
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      toast.error("something went wrong")
      dispatch(deleteUserFailure(data.message));
    }
  };

  return (
    <div className="bg-cover bg-center min-h-screen">
       <main className="container mx-auto px-3 py-2 pb-8 ">
   
    <h1 className="text-4xl font-bold text-center my-7 text-gray-800">
  <span className="text-red-500">My</span> Profile
</h1>
<div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-3 pb-4 sm:p-6">
      <div className="flex justify-center mb-2">
      <input
        
        onChange={(e) => setFile(e.target.files[0])}
        type="file"
        ref={fileRef}
        hidden
        accept="image/*"
      />
      <img
        onClick={() => fileRef.current.click()}
        src={formData.avatar || currentUser.avatar}
        alt="profile"
        className="rounded-full h-32 w-32 border-4 border-slate-500 object-cover cursor-pointer  mt-2"
      />
      </div>
        

        

        <p className="text-sm text-center">
          {fileUploadError ? (
            fileUploadError == "Image successfully uploaded!" ? (
              <span className="text-green-700">{fileUploadError}</span>
            ) : (
              <span className="text-red-700">{fileUploadError}</span>
            )
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading images:${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-purple-700 text-sm">wait..</span>
          ) : (
            ""
          )}
        </p>

       { editMode?(<input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          id="username"
          className="mt-4 border p-3 w-full rounded-lg mb-2"
          onChange={handleChange}
        />):(<p className="text-md text-center text-gray-600 pt-2 mb-4">{currentUser.username}</p>)}

      { editMode?(<input
          type="email"
          placeholder="Email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 w-full rounded-lg mb-2"
          onChange={handleChange}
     />):(<p className="text-md text-center text-gray-600 mb-4">{currentUser.email}</p>)}

      { editMode?(<input
          type="password"
          placeholder="Password"
          onChange={handleChange}
          id="password"
          className="border p-3 w-full rounded-lg mb-2"
          />):('')}

     { editMode?(<input
          type="phone"
          placeholder="Contact No."
          onChange={handleChange}
          defaultValue={currentUser.phone}
          id="phone"
          className="border p-3 w-full rounded-lg mb-5"
          />):(<p className="text-md text-center text-gray-600 mb-4">{currentUser.phone}</p>)}

      {editMode?(
        <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-slate-700 text-white w-full rounded-lg p-3 hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Saving..." : "Save"}
        </button>
         <button
         onClick={()=>setEditMode(false)}
         
         className="bg-slate-700 text-white w-full rounded-lg p-3  hover:opacity-95 disabled:opacity-80"
       >
         Discard
       </button>
       </div>
      ):(
        <button
          onClick={()=>setEditMode(true)}
          
          className="bg-slate-700 text-white w-full rounded-lg p-3  hover:opacity-95 disabled:opacity-80"
        >
         Update Profile
        </button>
      )}

<hr className="mt-7  border-slate-700" />



<div className="flex justify-between gap-3 mt-2 sm:mt-5 ">
         
         <Link
             className="bg-green-600 text-center hidden sm:block hover:bg-green-700 text-white flex-1 py-3 rounded-lg shadow-md "
             to={"/create-listing"}
           >
             Create Listing
           </Link>
   
          
       <Link className='bg-slate-700 text-center hidden sm:block hover:bg-gray-600 text-white flex-1 py-3 rounded-lg shadow-md '
       to={"/showlisting"}
       >
           My listings
       </Link>
         
         </div>

        <div className="flex justify-between gap-3 mt-1">
        <button
          onClick={()=>openDeleteConfirmation(currentUser._id)}
          className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg shadow-md w-full mt-4"
        >
          Delete account
        </button>
        <button onClick={handleSignOut} className="bg-gray-500 hover:bg-slate-600 text-white py-3 rounded-lg shadow-md w-full mt-4">
          Log out
        </button>
      </div>
      

     
      
</div>
        
    
       
        {deleteListingId && (
        <div className='fixed inset-0 z-50 flex items-center p-3 justify-center bg-gray-900 bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg'>
            <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
            <p className='text-gray-600 mb-4'>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className='flex justify-end'>
              <button onClick={closeDeleteConfirmation} className='bg-gray-300 text-gray-700 px-4 py-2 rounded mr-4 hover:bg-gray-400'>
                Cancel
              </button>
              <button onClick={handleDeleteUser} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )} 

    </main>
    <Footer/>
    </div>
   
  );
}


