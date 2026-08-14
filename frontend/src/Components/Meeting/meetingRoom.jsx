import { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import { useParams,useNavigate } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;


export default function MeetingRoom() {

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const navigate = useNavigate();

    let {meetingId}=useParams();
    const localVideoRef=useRef(null);
    const localStreamRef = useRef(null);
    const peerConnectionRef=useRef(null);
    const remoteVideoRef=useRef(null);
    const remoteSocketId=useRef(null);

    const toggleMute=()=>{
      if(!localStreamRef.current) return;

      localStreamRef.current.getAudioTracks().forEach((track)=>{
        track.enabled=!track.enabled;
      });
      setIsMuted(!isMuted);
    };

    const toggleVideo=()=>{
      if(!localStreamRef.current) return;

      localStreamRef.current.getVideoTracks().forEach((track)=>{
        track.enabled=!track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }

    const endCall=async()=>{

      try{
        await axios.post(`${API}/api/meeting/endMeeting`,
        {meetingId},
        {withCredentials:true}
      )
      }catch(error){
        console.log(error);
      }

      if(!localStreamRef.current) return;

      if (localStreamRef.current) {

        localStreamRef.current.getTracks().forEach(track => {
            track.stop();
        });

        localStreamRef.current = null;
    }
       if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
    }

    if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
    }


      socket.disconnect();  
      navigate("/dashboard",{
        replace:true
      });
    }

    const createPeerConnection=()=>{
      const pc=new RTCPeerConnection({
        iceServers:[
          {
            urls:"stun:stun.l.google.com:19302"
          }
        ]
      });
      //change
      pc.ontrack = (event) => {
        console.log("Remote Stream Received");
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      localStreamRef.current
      .getTracks().forEach((track)=>{
        pc.addTrack(
          track,
          localStreamRef.current
        );
      });
      //change
      pc.onicecandidate=(event)=>{
        if(event.candidate){
          socket.emit("ice-candidate",{
            candidate:event.candidate,
            target:remoteSocketId.current
          }
        )
      };
    };
      peerConnectionRef.current=pc;
      return pc;
    }
    useEffect(()=>{
        
        let startMedia=async()=>{
          try{
            console.log("startMedia Called");
            let stream=await navigator.mediaDevices.getUserMedia({
              video:true,
              audio:true,
            });

            localStreamRef.current=stream;

            localVideoRef.current.srcObject = stream;
          }catch(error){
            console.log(error);
          }
        }

        startMedia();

        // console.log("before Connect")
        socket.connect();
        // console.log("after connect")
        socket.on("user-joined",async (socketId)=>{
            remoteSocketId.current=socketId;
            const pc=createPeerConnection();
            const offer=await pc.createOffer();

            await pc.setLocalDescription(offer);
            socket.emit(
              "offer",
              {
                offer,
                target:socketId,
              }
            )
        })
        socket.emit("join-room",meetingId);
        socket.on("offer",
          async({offer,sender})=>{
             console.log("Offer Received");
            const pc=createPeerConnection();
            remoteSocketId.current=sender;
            await pc.setRemoteDescription(
              offer
            );  
            const answer=await pc.createAnswer();

            await pc.setLocalDescription(answer);

            socket.emit(
              "answer",
              {
                answer,
                target:sender,
              }
            );

          }
        )
        socket.on("answer",
          async({answer})=>{
            console.log("Answer Received");
            await peerConnectionRef.current.setRemoteDescription(answer)}
        )

        socket.on("ice-candidate",
          async({candidate})=>{
            console.log("ICE Received");
            if(peerConnectionRef.current){
              await peerConnectionRef.current.addIceCandidate(candidate);
            }
          }
        )
        return ()=>{
          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track)=> track.stop());
          }
           if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
           }

            socket.off("user-joined")
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
            socket.disconnect();
        }
    },[]);
    return(
       <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <div className="border-b border-slate-800 p-5">

        <h1 className="text-3xl font-bold">
          Meeting Room
        </h1>

        <p className="text-slate-400 mt-2">
          Meeting ID:{" "}
          <span className="font-semibold text-green-400">
            {meetingId}
          </span>
        </p>

      </div>

      {/* Video Section */}
      <div className="flex justify-center items-center h-[85vh] p-6">

        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">

          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            className="w-[800px] max-w-full"
          />
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-5">

  <button
    onClick={toggleMute}
    className="bg-slate-800 p-4 rounded-full hover:bg-slate-700"
  >
    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
  </button>

  <button
    onClick={toggleVideo}
    className="bg-slate-800 p-4 rounded-full hover:bg-slate-700"
  >
    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
  </button>

  <button
    onClick={endCall}
    className="bg-red-600 p-4 rounded-full hover:bg-red-700"
  >
    <PhoneOff size={24} />
  </button>

</div>

        </div>
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-[800px] max-w-full"
          />
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-5">

  <button
    onClick={toggleMute}
    className="bg-slate-800 p-4 rounded-full hover:bg-slate-700"
  >
    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
  </button>

  <button
    onClick={toggleVideo}
    className="bg-slate-800 p-4 rounded-full hover:bg-slate-700"
  >
    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
  </button>

  <button
    onClick={endCall}
    className="bg-red-600 p-4 rounded-full hover:bg-red-700"
  >
    <PhoneOff size={24} />
  </button>

</div>
        </div>

      </div>

    </div>
    )}
  