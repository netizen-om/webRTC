import React, { useEffect, useState } from 'react'

function Reciever() {

  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
          const socket = new WebSocket("ws://localhost:3001")
          socket.onopen = () => {
              socket.send(JSON.stringify({ type : " receiver" }))
          }

          socket.onmessage = async(event) => {
            const message = JSON.parse(event.data);

            if (message.type === "createOffer") {
              const pc = new RTCPeerConnection();
              pc.setRemoteDescription(message.sdp);
              const answer = await pc.createAnswer();
              pc.setLocalDescription(answer);

              socket.send(JSON.stringify({ type: "answer", sdp: pc.localDescription }));
            }
          }

      }, [])

  return (
    <div>
      <div>Reciever</div>
    </div>
  )
}

export default Reciever