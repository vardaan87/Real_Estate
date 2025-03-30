import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaBars } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {toast} from "react-toastify"

import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Footer from '../components/Footer';
import { useSetState } from '@mantine/hooks';

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [userData,setUserData]=useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [dataResponse,setDataResponse]=useState(null);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [slideNumber, setSlideNumber] = useState(0);
  const [isPaid,setIsPaid]=useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const navigate=useNavigate();
  const slideshowIntervalRef = useRef(null);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);


  useEffect(() => {
    if (!isPaused) {
      slideshowIntervalRef.current = setInterval(() => {
        // Automatically move to the next slide if not paused
        setSlideNumber((prevSlideNumber) => (prevSlideNumber + 1) % (listing?.imageUrls?.length || 1));
      }, 2000); // Change slide every 5 seconds (adjustable)
    } else {
      clearInterval(slideshowIntervalRef.current);
    }

    return () => {
      clearInterval(slideshowIntervalRef.current); // Clean up interval on component unmount
    };
  }, [isPaused, listing?.imageUrls]);

  const handleImageClick = () => {
    setIsPaused((prevIsPaused) => !prevIsPaused); // Toggle pause/resume on image click
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${currentUser?._id}`);
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        setUserData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) {
      fetchListing();
    }
  }, [currentUser?._id]);
  

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? listing.imageUrls.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === listing.imageUrls.length - 1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber)
  };
const [load,setLoad]=useState(false);

  const makePayment = async (e) => {
    if (userData.payment === true) {
      setContact(true);
      return;
    } 
    
    try {
     setLoad(true);
      const response = await fetch("https://trendyhomeshrs.onrender.com/order", {
        
        method: "POST",
        body: JSON.stringify({
          amount: 50000,
          currency: "INR",
          receipt: "djfdkjf"
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      setDataResponse(data);
      setLoad(false);
  
      // Proceed if payment request was successful
      var options = {
        "key": "rzp_test_CI0M0SNtL3FtoV", // Enter the Key ID generated from the Dashboard
        "amount": 50000,
        "currency": "INR",
        "name": "TrendyHomes", // Your business name
        "description": "Secure your dream home with TrendyHomes",
        "image": "https://firebasestorage.googleapis.com/v0/b/hrs-estate.appspot.com/o/investment.png?alt=media&token=21ea533c-3612-46af-b9bc-4a4b78e740bd",
        "order_id": data.id, // Use the id directly from the response
        "handler": async function (response) {
          toast.success('Transaction Successful!')
          try {
            // Update currentUser.payment to true after successful payment
            const updatedUser = { ...currentUser, payment: true };
            const userUpdateResponse = await fetch(`/api/user/update/${currentUser._id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedUser),
            });

            const userData = await userUpdateResponse.json();
            setUserData(userData);
             setIsPaid(true);
            // Schedule payment reset after 10 minutes
            setTimeout(async () => {
              const resetUser = { ...currentUser, payment: false };
              const resetUserResponse = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(resetUser),
              });

              const resetUserData = await resetUserResponse.json();
              setUserData(resetUserData);

              // Notify user about payment reset
              toast.info('Payment status reset. Please make payment again.');
            },  24*60*60*1000);}
             catch (error) {
            console.error("Error updating user payment:", error);
          }
        },
        "prefill": {
          "name": currentUser.name,
          "email": currentUser.email,
          "contact": currentUser.phone
        },
        "theme": {
          "color": "#2c3a4b" // Custom color for the payment button
        }
      };
  
      var rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        // Error handling...
        toast.error("Payment failed! Please try again.")
      });
      rzp1.open();
      e.preventDefault();
    } catch (error) {
      toast.error(error)
      console.error("Error making payment:", error);
    }
  };
  

  return (
    <div className='bg-cover bg-center h-[410px] sm:h-[500px] '>
    <main className="p-3 mt-1 ">
      {loading && <p className='text-center my-7 text-2xl'><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
         <div>
          <div>
         <div className="relative ">
           <div className="flex items-center h-[350px] sm:h-[550px] w-full mx-auto sm:w-[70%] " 
            onClick={handleImageClick}>
             <FontAwesomeIcon
               icon={faCircleArrowLeft}
               onClick={() => handleMove("l")}
               className="text-3xl sm:text-5xl text-gray-200 sm:text-gray-600 cursor-pointer absolute left-1 sm:left-[231px] z-20"
             />
             {listing.imageUrls && (
               <img
                 src={listing.imageUrls[slideNumber]}
                 alt=""
                 className="w-full h-full object-cover rounded-md"
               />
             )}
             <FontAwesomeIcon
               icon={faCircleArrowRight}
               onClick={() => handleMove("r")}
               className="text-3xl sm:text-5xl text-gray-200 sm:text-gray-600 cursor-pointer absolute right-1 sm:right-[231px] z-20"
             />
           </div>
           <div className="absolute right-1 sm:right-[231px] top-1.5 z-10 border rounded-full w-8 sm:w-12 h-8 sm:h-12 flex justify-center items-center bg-gray-200 cursor-pointer">
             <FaShare
               className="text-gray-600"
               onClick={() => {
                 navigator.clipboard.writeText(window.location.href);
                 setCopied(true);
                 setTimeout(() => {
                   setCopied(false);
                 }, 2000);
               }}
             />
           </div>
         </div>
         {copied && (
           <p className='fixed top-[110px] sm:top-[16%] right-3 sm:right-[8%] z-10 rounded-md bg-gray-700 text-gray-200 p-2'>
             Link copied!
           </p>
         )}
       </div>
     
          
       <div className="flex justify-center mt-4">
              {listing.imageUrls && listing.imageUrls.map((url, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 sm:h-4 sm:w-4 mx-1 rounded-full cursor-pointer ${index === slideNumber ? 'bg-gray-800' : 'bg-gray-400'}`}
                  onClick={() => {
                    setSlideNumber(index);
                    setIsPaused(true); // Pause slideshow when navigating to a specific slide
                  }}
                />
              ))}
            </div>
        
         
          <div className='max-w-[66rem] mx-auto p-3 my-7 space-y-4 bg-gray-100 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold text-gray-800'>
  <span className='text-2xl text-red-600'> ₹ {listing.offer ? (+listing.regularPrice - +listing.discountPrice).toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
  {listing.type === 'rent' && '/month'}</span>
</h2>
<span className='text-xl '>{listing.name}</span>
<p className='flex items-center gap-2 text-gray-600 text-sm overflow-x-auto'>
  <FaMapMarkerAlt className='text-green-700' />
  <span>{listing.locality}, {listing.city}, {listing.state}</span>
</p>
  <div className='flex gap-4'>
    <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
      {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
    </p>
    {listing.offer && (
      <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
        ₹ {listing && listing.discountPrice.toLocaleString('en-US')} OFF
      </p>
    )}
  </div>
  <p className='text-gray-700'>
    <span className='font-semibold text-black'>Description - </span>
    {listing.description}
  </p>
  <ul className='text-gray-800 font-semibold text-sm flex flex-wrap gap-4 sm:gap-6'>
    <li className='flex items-center gap-1 whitespace-nowrap '>
      <FaBed className='text-lg text-green-700' />
      {listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'}
    </li>
    <li className='flex items-center gap-1 whitespace-nowrap '>
      <FaBath className='text-lg text-green-700' />
      {listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}
    </li>
    <li className='flex items-center gap-1 whitespace-nowrap '>
      <FaParking className='text-lg text-green-700' />
      {listing.parking ? 'Parking spot' : 'No Parking'}
    </li>
    <li className='flex items-center gap-1 whitespace-nowrap '>
      <FaChair className='text-lg text-green-700' />
      {listing.furnished ? 'Furnished' : 'Unfurnished'}
    </li>
  </ul>
  {currentUser ? (
  // If user is logged in
  listing.userRef !== currentUser._id && !contact && (
    <div>
      {userData && userData.payment === false && (
      isPaid ? (
     
        <p className="text-black text-sm mb-2">
        Your subscription has expired. Please renew your payment to continue accessing unlimited contact details.
      </p>
    ) : (
      // Render if user has not made the payment yet
      <p className="text-black text-sm mb-2 mt-10">
        Please make a <b>one-time payment of INR 500</b> to see complete address and owner's contact details.
        This payment will provide unlimited access to contact details for a year.
      </p>
     )
    
      )}
      <button
        onClick={makePayment}
        className='bg-slate-700 w-full text-white rounded-lg  hover:opacity-95 p-3'
      >
        {userData && userData.payment === false ? (load?('Processing'):(isPaid?('Renew Payment'):('Make Payment'))):'Contact Landlord' }
      </button>
    </div>
  )
) : (
  // If user is not logged in
  <button
    onClick={()=> navigate('/sign-in') }
    className='bg-slate-700 w-full text-white rounded-lg  hover:opacity-95 p-3'
  >
    Login to see details
  </button>
)}


{contact && <Contact listing={listing} />}
</div>

        </div>
      )}
    </main>
    <Footer/>
    </div>
  );
}
