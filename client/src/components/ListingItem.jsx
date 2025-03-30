import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-md transition duration-300 ease-in-out transform hover:shadow-lg hover:scale-105 overflow-hidden rounded-lg w-full sm:w-[322px]'>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover transition duration-300 ease-in-out transform hover:scale-105'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700 hover:text-slate-500 transition duration-300'>{listing.name}</p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-6 w-6 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>{listing.locality}, {listing.city}, {listing.state}</p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
          <p className='text-red-500 mt-2 font-semibold'>
          ₹
               {listing.regularPrice.toLocaleString('en-US')}
             
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedrooms > 1 ? `${listing.bedrooms} bedroom ` : `${listing.bedrooms} bedroom `}
            </div>
            <div className='font-bold text-xs'>
              {listing.bathrooms > 1 ? `${listing.bathrooms} bathroom ` : `${listing.bathrooms} bathroom `}
            </div>
            <div className='font-bold text-xs'>
              {+listing.discountPrice > 0 ? <span className='text-green-600'>Discount Available</span> : <span className='text-red-600'>No discount Available </span>}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
