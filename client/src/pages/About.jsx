import React from 'react';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className='bg-cover bg-center h-[410px] sm:h-[500px]'>
     <div className='py-10 px-4 mt-5 max-w-5xl mx-auto relative'>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'>Discover <span style={{ color: '#ff0000' }}>Trendy</span>Homes</h1>
      <p className='mb-4 text-slate-700'>Welcome to TrendyHomes, where every property tells a unique story.</p>
      <p className='mb-4 text-slate-700'>
        At TrendyHomes, we redefine the real estate experience by blending expertise with innovation. Our dedicated team of professionals is committed to delivering unparalleled service, ensuring your journey in the world of real estate is not just successful but also memorable.
      </p>
      <p className='mb-4 text-slate-700'>
        With a deep understanding of the ever-evolving market trends and a passion for excellence, we strive to exceed your expectations at every turn. Whether you're searching for your dream home, looking to sell your property, or seeking expert guidance in investment opportunities, TrendyHomes is your trusted partner every step of the way.
      </p>
      <p className='mb-4 text-slate-700'>
        Experience the difference with TrendyHomes – where integrity, innovation, and inspiration converge to create extraordinary real estate experiences.
      </p>

      <div className='flex flex-col'>
        
      
        <img className='h-[120px] w-[200px]' src="../../sign.jpg" alt="Harsh Raj Sign" />
        <p className=' text-slate-800  text-xl  '>Harsh Raj</p>
      <p className=' text-slate-800  text-xl  '>Founder &amp; Developer</p>

       
      </div>
     
      

    
    </div>
    <Footer/>
    </div>
   
  );
}
