import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

export default function ShowListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const [deleteListingId, setDeleteListingId] = useState(null);
  const [loading,setLoading]=useState(false);



  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      toast.success('Listing deleted successfully');
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      setDeleteListingId(null); // Close the modal after successful deletion
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowListings = async () => {
    try {
      setLoading(true);
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setLoading(false);
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  useEffect(() => {
    handleShowListings();
  }, []);

  const openDeleteConfirmation = (listingId) => {
    setDeleteListingId(listingId);
  };

  const closeDeleteConfirmation = () => {
    setDeleteListingId(null);
  };

  return (
    <div className='mt-8 p-2 smp-3 max-w-4xl mx-auto'>
       <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
  <span className="text-red-500">My</span> Listings
</h1>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 '>
        {userListings.map((listing) => (
          <div key={listing._id} className='border rounded-lg overflow-hidden shadow-md transition duration-300 ease-in-out transform hover:shadow-lg hover:scale-105'>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt='listing cover' className='h-48 w-full object-cover' />
            </Link>
            <div className='p-4'>
              <Link className='text-slate-600  font-semibold hover:underline' to={`/listing/${listing._id}`}>
                <h3 className='text-xl '>{listing.name}</h3>
              
              </Link>
              <span ><span className='text-slate-600'>Price:</span> ₹ {listing && listing.regularPrice.toLocaleString('en-US')}  {listing && listing.type === 'rent' && ' /month'}</span>
              
              <div className='flex gap-4 mt-3'>
   
                    <button
                  onClick={() => openDeleteConfirmation(listing._id)}
                  className='bg-red-500 w-full max-w-[200px] text-white text-center p-1 rounded-md'
                >
                  Delete
                </button>
     
                
              <Link 
              className='bg-green-500 w-full max-w-[200px] text-white text-center p-1 rounded-md'
              to={`/update-listing/${listing._id}`}>
                  <button >Edit</button>
                </Link>
    
  </div>

            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteListingId && (
        <div className='fixed inset-0 z-50 p-3 flex items-center justify-center bg-gray-900 bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg'>
            <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
            <p className='text-gray-600 mb-4'>Are you sure you want to delete this listing?</p>
            <div className='flex justify-end'>
              <button onClick={closeDeleteConfirmation} className='bg-gray-300 text-gray-700 px-4 py-2 rounded mr-4 hover:bg-gray-400'>
                Cancel
              </button>
              <button onClick={() => handleListingDelete(deleteListingId)} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
       {loading && (
        <div className=' flex items-center justify-center h-screen'>
          <p className='text-xl text-slate-700 text-center w-full '>
              <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </p>
          </div>
            
          )}
      {!loading && userListings.length === 0 && (
        <div className='flex  justify-center '>
          <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center'>
            <h2 className='text-3xl font-semibold mb-4'>Nothing Here Yet!</h2>
            <p className='text-gray-600 mb-8'>
              Looks like there are no listings. Click below to add a new listing.
            </p>
            <Link
              to='/create-listing'
              className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg  transition duration-300 ease-in-out'
            >
              Create Listing
            </Link>
          </div>
        </div>
      )}

    
    </div>
  );
}
