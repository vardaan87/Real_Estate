import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai'
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import Footer from "../components/Footer";
import {toast} from "react-toastify"
export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const [showPassword,setShowPassword]=useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
   
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error(data.message)
        return;
      }
      toast.success("Logged in successfully")
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      toast.error(error.message)
      // dispatch(signInFailure(error.message));
    }
  };

  const handleShowPassword=()=>{
     setShowPassword(!showPassword);
  }
  return (
  <div>
    <div class="flex items-center justify-center min-h-screen">
    <div
      class="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0"
    >
     
      <div class="flex flex-col justify-center p-5 md:p-14">
        <span class="mb-3 text-4xl font-bold">Welcome back</span>
        <span class="font-light text-gray-500 mb-8">
          Please Login to proceed furthur
        </span>
        <form onSubmit={handleSubmit} className="w-[280px] sm:w-[300px]">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 w-full mb-4 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <div className='relative flex '>
           <input
          type={showPassword? 'text' : 'password'}
          placeholder="Password"
          className="border p-3 rounded-lg w-full"
          id="password"
          onChange={handleChange}
        />
        <span onClick={handleShowPassword} className="cursor-pointer absolute right-3 top-3.5 ">
        {showPassword?< AiOutlineEyeInvisible fontSize={20} /> :<AiOutlineEye fontSize={20}  />}
        </span>
        </div>
        <div class="flex justify-between w-full py-3 mb-4">
          <div class="mr-24">
            
          </div>
          <span class="font-bold text-sm">Forgot password</span>
        </div>
       
        <button
          disabled={loading}
          className="bg-slate-700 text-white mb-6 p-3 w-full rounded-lg  hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading": "Log In"}
        </button>
      <OAuth/>
      </form>
      
        <div className="flex gap-2 mt-3 text-sm">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700 "><u>Sign up</u></span>
        </Link>
      </div>
      </div>
    
      <div class="relative">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/hrs-estate.appspot.com/o/image.jpg?alt=media&token=697c7592-5cf6-4267-81a4-71640b74c38a"
          alt="img"
          class="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
        />
    
        <div
          class="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block"
        >
          <span class="text-white text-xl left-4">
  "Untitle has been invaluable for <br /> our  real estate projects, property <br /> listings,  and client interactions."
</span>

        </div>
      </div>
    </div>
  </div>
  <Footer/>
   </div>
  );
}



