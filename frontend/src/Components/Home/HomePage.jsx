import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function HomePage() {
  const navigate=useNavigate();
  let handleGetStarted=async(e)=>{
    e.preventDefault();
    
    try{
      const res=await axios.get("http://localhost:8080/me",
      {
        withCredentials: true,
      });
      
      if(res.data.success){
        navigate("/dashboard");
      }

    }catch(err){
      navigate("/auth");
    }
  }
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 sm:px-8 text-center text-white">

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
          Connect Beyond
          <span className="block text-blue-400">
            Distance
          </span>
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl text-gray-300">
          Experience seamless video meetings, crystal-clear communication,
          and effortless collaboration from anywhere in the world.
        </p>

        {/* Quote */}
        <div className="mt-8 max-w-2xl">
          <p className="italic text-base sm:text-lg md:text-xl text-blue-200">
            "Technology is best when it brings people together."
          </p>
          <p className="mt-2 text-sm text-gray-400">
            — Matt Mullenweg
          </p>
        </div>

        {/* Button */}
        
        <button
          className="
            mt-10
            px-8 py-3
            sm:px-10 sm:py-4
            bg-blue-600
            rounded-full
            font-semibold
            text-base sm:text-lg
            shadow-lg
            hover:bg-blue-700
            hover:scale-105
            active:scale-95
            transition-all
            duration-300
          "
          onClick={handleGetStarted}
        >
          Get Started 🚀
        </button>
        

        {/* Features */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl">

          <div className="backdrop-blur-md bg-white/10 p-5 rounded-2xl border border-white/20 hover:scale-105 transition duration-300">
            <h3 className="text-lg font-bold mb-2">
              HD Video Calls
            </h3>
            <p className="text-gray-300 text-sm">
              Crystal-clear video and audio for professional meetings.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/10 p-5 rounded-2xl border border-white/20 hover:scale-105 transition duration-300">
            <h3 className="text-lg font-bold mb-2">
              Instant Meetings
            </h3>
            <p className="text-gray-300 text-sm">
              Create or join meetings in seconds with a single click.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/10 p-5 rounded-2xl border border-white/20 hover:scale-105 transition duration-300 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold mb-2">
              Secure Communication
            </h3>
            <p className="text-gray-300 text-sm">
              End-to-end protection for safe and private conversations.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}