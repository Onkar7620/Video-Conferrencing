export default function socketHandler(io){
    io.on("connection",(socket)=>{

        socket.on("join-room",(meetingId)=>{
            socket.join(meetingId);

            socket.to(meetingId).emit("user-joined",socket.id)
        })
        socket.on("disconnect",()=>{
        })
        //offer
        socket.on("offer",
            ({offer,target})=>{
                io.to(target).emit(
                    "offer",{
                        offer,
                        sender:socket.id

                    }
                );
            }
        );

        //Answer

        socket.on("answer",({answer,target})=>{
            io.to(target).emit(
                "answer",{
                    answer,
                    sender:socket.id
                }
            )
        });

        //ICE candidate

        socket.on("ice-candidate",
            ({candidate,target})=>{
                io.to(target).emit("candidate",
                {
                    candidate,
                    sender:socket.id
                })
            }
        )
    });
}