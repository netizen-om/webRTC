import React, { useEffect, useState } from 'react'

function Reciever() {

  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
          const socket = new WebSocket("ws://localhost:3001")
          setSocket(socket);
          socket.onopen = () => {
              socket.send(JSON.stringify({type : "receiver"}))
              console.log("Receiver connected to WebSocket server");
          }

          socket.onmessage = async(event) => {
            const message = JSON.parse(event.data);
            console.log("Received SDP:", message);

            if (message.type === "createOffer") {
              const pc = new RTCPeerConnection();
              await pc.setRemoteDescription(message.sdp);
              
              pc.onicecandidate = (event) => {
                if (event.candidate) {
                  console.log("ICE Candidate changed:", event.candidate);
                  socket?.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }));
                }
              };
              
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);


              socket.send(JSON.stringify({ type: "answer", sdp: pc.localDescription }));
            }
          }

      }, [])

  return (
    <div>
      <div>Receiver</div>
    </div>
  )
}

export default Reciever