import React, { useEffect, useState } from 'react'

function Reciever() {
  
  const videoRef = React.useRef<HTMLVideoElement>(null);
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
                  socket?.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }));
                  console.log("ICE Candidate change required, request sent to sender");
                }  
              };

              pc.ontrack = (event) => {
                console.log("Track received:", event); 
                console.log("Setting video source to received track");
                
                if (videoRef.current) {
                  console.log("Video element found, setting source");
                  
                  videoRef.current.srcObject = new MediaStream([event.track]);
                }
              }
              
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              
              
              socket.send(JSON.stringify({ type: "answer", sdp: pc.localDescription }));
            } else if (message.type === "iceCandidate") {
              console.log("ICE Candidate received from sender:", message.candidate);
              
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
      <video ref={videoRef} autoPlay></video>
    </div>
  )
}

export default Reciever