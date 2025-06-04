import React, { useEffect, useState } from 'react'

function Reciever() {

  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
          const socket = new WebSocket("ws://localhost:3001")
          socket.onopen = () => {
              socket.send(JSON.stringify({ type : "receiver" }))
          }
      }, [])

  const startSendingVideo = async() => {
    const pc = new RTCPeerConnection();
    const offer = await pc.createOffer();
  }

  return (
    <div>
      <div>Reciever</div>
      <button onClick={startSendingVideo}>Send Video</button>
    </div>
  )
}

export default Reciever