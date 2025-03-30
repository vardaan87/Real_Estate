import React, { useState ,useEffect} from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Type from '../components/Type';
import ListingItem from '../components/ListingItem';
import Footer from '../components/Footer';

const HomePage = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  const [serachTerm,setSearchTerm]=useState('')
   const navigate=useNavigate();


   useEffect(() => {
     const fetchOfferListings = async () => {
       try {
         const res = await fetch('/api/listing/get?offer=true&limit=6');
         const data = await res.json();
         setOfferListings(data);
         fetchRentListings();
       } catch (error) {
         console.log(error);
       }
     };
     const fetchRentListings = async () => {
       try {
         const res = await fetch('/api/listing/get?type=rent&limit=6');
         const data = await res.json();
         setRentListings(data);
         fetchSaleListings();
       } catch (error) {
         console.log(error);
       }
     };
 
     const fetchSaleListings = async () => {
       try {
         const res = await fetch('/api/listing/get?type=sale&limit=6');
         const data = await res.json();
         setSaleListings(data);
       } catch (error) {
         log(error);
       }
     };
     fetchOfferListings();
   }, []);
 
  
 

  const handleSubmit=()=>{
    const urlParams=new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',serachTerm);
    const searchQuery=urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }
  return (
    <div className="bg-cover bg-center h-[410px] sm:h-[500px]" style={{ backgroundImage: `url('../../city2.jpg')` }}>
      <div className='flex flex-col gap-6 mt-0 px-3 max-w-5xl mx-auto '>
        <h1 className='text-slate-700 font-bold mt-[50px] sm:mt-[80px] text-3xl lg:text-6xl'>
          Find your ideal <span className='text-slate-500'>home </span>at
          <br />
         
          {/* <span className='text-slate-500'>HRS</span> Estate */}
          <Type/>
        </h1>
        <div className='text-gray-500 text-xs sm:text-sm'>
        Welcome to TrendyHomes, your destination for finding your dream home. 
          <br />
          
         Explore our diverse range of properties and discover your perfect place to live today!
        </div>
        <div className="text-center flex ">
          <Link
            to={'/search'}
            className='inline-block px-4 py-4 bg-red-200 text-gray-700 font-bold rounded-md hover:bg-red-300'
          >
            Let's get started...
          </Link>
        </div>
      </div>
      
      <div className="flex mt-[50px] max-w-5xl mx-auto">
        <input 
          type="text" 
          placeholder="Search..." 
          className="flex-1 px-3 py-3 ml-2  sm:py-4 border border-gray-300 rounded-l-md shadow-md focus:outline-none  text-sm sm:text-base border-r-0" 
          value={serachTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}

        />
        <button 
          className="flex items-center border-l-0 mr-2 justify-center px-4 sm:px-11   bg-slate-700 text-gray-100 rounded-r-md shadow-md hover:bg-slate-600 focus:outline-none  text-sm sm:text-base"
          onClick={handleSubmit}
        >
          <FaSearch className="text-gray-100" />
          <span className="ml-2">Search</span>
        </button>
      </div>


      <div className='max-w-5xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default HomePage;
