import { Video, PlusCircle } from "lucide-react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const navigate=useNavigate()
  const [meetingId,setMeetingId]=useState("");

  let handleMeetingId=(e)=>{
    setMeetingId(e.target.value);
  }

 let handleCreateBtn =async(e)=>{
  try{
    let res=await axios.post(`${API}/api/meeting/createMeeting`,
    {},
    {withCredentials:true}
  );
  navigate(`/meeting/${res.data.meeting.meetingId}`)
  }catch(error){
    alert(error.response.data.message)
  }
 }

  let handleConnect=async(e)=>{
    e.preventDefault();
    try{
    let res=await axios.post(`${API}/api/meeting/joinMeeting`,
      {meetingId},
      {withCredentials:true}
    )
    navigate(`/meeting/${res.data.meeting.meetingId}`);
  }catch(error){
    alert(error.response.data.message);
  }
  }
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Video size={50} className="text-blue-500" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Video Conference
          </h1>

          <p className="text-gray-400 mt-2">
            Join or create a meeting instantly
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* <div>
            <label className="block text-gray-300 mb-2">
              Meeting Name
            </label>
            <input
              type="text"
              placeholder="Enter meeting name"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none focus:border-blue-500"
            />
          </div> */}

          <div>
            <label className="block text-gray-300 mb-2">
              Meeting Code
            </label>
            <input
              type="text"
              placeholder="Enter meeting code"
              value={meetingId}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none focus:border-blue-500"
              onChange={handleMeetingId}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-lg text-white font-semibold"
            onClick={handleConnect}
          >
            Connect
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* Create Meeting */}
        <button
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition py-3 rounded-lg text-white font-semibold"
          onClick={handleCreateBtn}
        >
          <PlusCircle size={20} />
          Create New Meeting
        </button>
      </div>
    </div>
  );
}