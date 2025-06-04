import React, { useEffect } from 'react'

function Sender() {

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:3001")
        socket.onopen = () => {
            socket.send(JSON.stringify({ type : "sender" }))
        }
    }, [])

  return (
    <div>Sender</div>
  )
}

export default Sender