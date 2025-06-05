import React, { useEffect, useState } from 'react'

function Reciever() {
  
  const [socket, setSocket] = useState<WebSocket | null>(null);
  // const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  let pc = new RTCPeerConnection();

  useEffect(() => {
          const socket = new WebSocket("ws://localhost:3001")
          setSocket(socket);
          socket.onopen = () => {
              socket.send(JSON.stringify({type : "receiver"}))
              console.log("Receiver connected to WebSocket server");
          }

          socket.onmessage = async(event) => {
            const message = JSON.parse(event.data);

            if (message.type === "createOffer") {
              pc = new RTCPeerConnection();
              
              await pc.setRemoteDescription(message.sdp);
              
              pc.onicecandidate = (event) => {
                if (event.candidate) {
                  console.log("ICE Candidate changed:");
                  socket?.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }));
                }  
              };

              pc.ontrack = (track) => {
                console.log("Track received:", track); 
                
              }
              
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              
              
              socket.send(JSON.stringify({ type: "answer", sdp: pc.localDescription }));
            } else if (message.type === "iceCandidate") {
              pc?.addIceCandidate(message.candidate)
            }
            
            // //@ts-ignore
            // pc?.ontrack = (track) => {
            //   console.log("Track received:", track); 
            // }
          }

      }, [])

  return (
    <div>
      <div>Receiver</div>
    </div>
  )
}

export default Reciever