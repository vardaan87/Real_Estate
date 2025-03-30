import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          phone:''
        }),
      });
      const data = await res.json();
    
      dispatch(signInSuccess(data));
    
      
      toast.success("Logged in successfully")
      navigate('/');
    } catch (error) {
      toast.error('Failed to log in with google')
      console.log('could not sign in with google', error);
    }
  };


  return (
    <button
    onClick={handleGoogleClick}
    type='button'
    className='w-full flex items-center justify-center gap-2 bg-white-700 text-gray-700 outline p-3 rounded-lg uppercase hover:opacity-95'
  >
    <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google Logo" className="w-6 h-6" />
    Continue with Google
  </button>
  
  );
}