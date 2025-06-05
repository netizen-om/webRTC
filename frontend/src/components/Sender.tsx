import React, { useEffect, useState } from 'react'

function Sender() {

  const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:3001")
        socket.onopen = () => {
            socket.send(JSON.stringify({ type : "sender" }))
        }
        setSocket(socket);
    }, [])

    const startSendingVideo = async() => {
      console.log("Starting to send video...");
      
      if (!socket) return;

      const pc = new RTCPeerConnection();
      const offer = await pc.createOffer(); //this gives SDP
      
      await pc.setLocalDescription(offer);
      socket?.send(JSON.stringify({ type: "createOffer", sdp : pc.localDescription }))

      socket.onmessage = async(event) => {
        const data = JSON.parse(event.data);
        if( data.type === "answer" ) {
          const answer = data.sdp;
          await pc.setRemoteDescription(answer);
          console.log("Answer received and set as remote description");
        }
      }

    }

  return (
    <div>  
      <div>Sender</div>
      <button onClick={startSendingVideo}>Send Video</button>
    </div>
  )
}

export default Sender