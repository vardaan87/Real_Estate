import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreListing from './pages/CreListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShowListing from './pages/ShowListing';

export default function App() {
  return (

    <BrowserRouter>
     <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search/>} />

        <Route path='/listing/:listingId' element={<Listing/>}/>

        <Route element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/create-listing' element={<CreListing/>}/>
        <Route path='/showlisting' element={<ShowListing/>}/>
        <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>


        

    

        </Route>

      </Routes>
      <ToastContainer 
        className="flex flex-col  fixed bottom-10 right-10 z-50 p-3 sm:p-0"
        toastClassName="bg-red-100 text-gray-800 font-semibold rounded-md shadow-md p-2 sm:p-4 mb-4"
        position="bottom-center"
        autoClose={1000}
        hideProgressBar
        closeButton={false}
        pauseOnHover={false}
        draggable={false}
        draggablePercent={60}
      />
    </BrowserRouter>
  
  );
}