import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaGlobe, FaLink, FaExclamationTriangle, FaHome, FaInfoCircle, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const handleReportIssue = () => {
    window.location.href = 'mailto:2021ugec066@nitjsr.ac.in'
  };

  return (
    <footer className="bg-slate-200 text-gray-700 py-8">
      <div className="container mx-auto px-4 max-w-8xl flex justify-evenly">
        <div>
          <h2 className="text-sm sm:text-lg font-semibold mb-4 flex items-center">
            <FaGlobe className="mr-2" />
            Explore
          </h2>
          <ul className="footer-links">
  <li className='flex items-center gap-2 text-xs sm:text-[15px]'>
    <FaHome />
    <Link to="/">
      <span >Home</span>
    </Link>
  </li>
  <li className='flex items-center gap-2 text-xs sm:text-[15px] mt-2'>
    <FaInfoCircle />
    <Link to="/about">
      <span >About Us</span>
    </Link>
  </li>
  <li className='flex items-center gap-2 text-xs sm:text-[15px] mt-2'>
    <FaCog />
    <Link to="#">
      <span >Services</span>
    </Link>
  </li>
  <li className='flex items-center gap-2 text-xs sm:text-[15px] mt-2'>
    <FaEnvelope />
    <Link to="#">
      <span >Contact</span>
    </Link>
  </li>
</ul>
        </div>

        <div>

          <h2 className="text-sm sm:text-lg font-semibold mb-4 flex items-center">
          <FaLink className="mr-2" />
            Connect
          </h2>
          <ul className="footer-links">
  <li className='flex items-center gap-2 text-xs sm:text-[15px] mt-2'>
    <FaFacebookF />
    <Link to="#">
      <span >Facebook</span>
    </Link>
  </li>
  <li className='flex items-center gap-2 text-xs sm:text-[15px] mt-2'>
    <FaTwitter />
    <Link to="#">
      <span >Twitter</span>
    </Link>
  </li>
  <li className='flex items-center gap-2 text-xs sm:text-[15px] mt-2'>
    <FaInstagram />
    <Link to="#">
      <span >Instagram</span>
    </Link>
  </li>
  <li className='flex items-center gap-2 text-xs sm:text-[15px] mt-2'>
    <FaLinkedinIn />
    <Link to="#">
      <span >LinkedIn</span>
    </Link>
  </li>
</ul>

        </div>

        <div className='max-w-[100px] sm:max-w-[600px]'>
          <h2 className="text-sm sm:text-xl font-semibold mb-4 flex items-center">
          <FaExclamationTriangle className="mr-2 hidden sm:block  " />
            Report Technical Issues
          </h2>
          <p className='text-xs sm:text-md'>If you encounter any technical issues while <br /> using our website, please feel free to <br /> email us at:</p>
          <button onClick={handleReportIssue} className="bg-red-300 hover:bg-red-400 text-gray-800 py-1 sm:py-2 px-2 sm:px-4 rounded-lg mt-3 sm:mt-4 transition-colors text-sm sm:text-[17px]">Report Issue</button>
        </div>
      </div>
      <div className="footer-column text-center text-gray-500 mt-6">
        &copy; 2024 TrendyHomes. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
