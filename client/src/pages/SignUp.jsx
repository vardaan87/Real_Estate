import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import Footer from "../components/Footer";
import {toast} from "react-toastify"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
export default function SignUp() {
  const [showPassword,setShowPassword]=useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleShowPassword=()=>{
    setShowPassword(!showPassword);
 }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        toast.error("user already exists")
        return;
      }
      toast.success(data.message);
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      toast.error("something went wrong!")
      
    }
  };
  return (
    <div>
    <div class="flex items-center justify-center min-h-screen">
    <div
      class="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0"
    >
     
      <div class="flex flex-col justify-center p-5 md:p-14">
        <span class="mb-3 text-4xl font-bold">Welcome</span>
        <span class="font-light text-gray-500 mb-8">
          Please Signup to explore TrendyHomes
        </span>
        <form onSubmit={handleSubmit} className="w-[280px] sm:w-[300px]">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg w-full mb-2"
          id="username"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Name"
          className="border capitalize p-3 rounded-lg w-full mb-2"
          id="name"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg w-full mb-2"
          id="email"
          onChange={handleChange}
        />
        <div className='relative flex '>
           <input
          type={showPassword? 'text' : 'password'}
          placeholder="Password"
          className="border p-3 rounded-lg w-full mb-2"
          id="password"
          onChange={handleChange}
        />
        <span onClick={handleShowPassword} className="cursor-pointer absolute right-3 top-3.5 ">
        {showPassword?< AiOutlineEyeInvisible fontSize={20}/> :<AiOutlineEye fontSize={20}/>}
        </span>
        </div>
           <input
          type="text"
          placeholder="Contact No."
          className="border p-3 rounded-lg w-full mb-4"
          id="phone"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg  hover:opacity-95 disabled:opacity-80 w-full mb-3"
        >
          {loading ? "loading" : "Sign Up"}
        </button>
        <OAuth />
      </form>
      
  
      <div className="flex gap-2 mt-3 text-sm">
        <p>Already have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700"><u>Log in</u></span>
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
