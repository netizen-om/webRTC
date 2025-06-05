import React, { useEffect, useState } from 'react'

function Sender() {

  const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:3001")
        socket.onopen = () => {
            socket.send(JSON.stringify({ type : "sender" }))
        }
    }, [])

    const startSendingVideo = async() => {
      const pc = new RTCPeerConnection();
      const offer = await pc.createOffer(); //this gives SDP
      pc.setLocalDescription(offer);
      socket?.send(JSON.stringify({ type: "createOffer", sdp : pc.localDescription }))
    }

  return (
    <div>  
      <div>Sender</div>
      <button onClick={startSendingVideo}>Send Video</button>
    </div>
  )
}

export default Sender