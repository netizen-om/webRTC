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

      
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sender ICE Candidate changed:");
          socket?.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }));
        }
      }
      
      pc.onnegotiationneeded = async() => {
        console.log("Negotiation needed");
        
        const offer = await pc.createOffer(); //this gives SDP
        await pc.setLocalDescription(offer);
        socket?.send(JSON.stringify({ type: "createOffer", sdp : pc.localDescription }))
      }

      socket.onmessage = async(event) => {
        const data = JSON.parse(event.data);
        if( data.type === "answer" ) {
          const answer = data.sdp;
          await pc.setRemoteDescription(answer);
          console.log("Answer received and set as remote description");
        } else if (data.type === "iceCandidate") {
          console.log(data.candidate);
          // if(pc.remoteDescription) {
            const candidate = data.candidate;
            
            await pc.addIceCandidate(candidate);
            console.log("ICE Candidate received and added:");
          // }
        }
      }
      getCameraStreamAndSend(pc);

      // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      // pc.addTrack(stream.getVideoTracks()[0]);

    }

        const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
          console.log("Getting camera stream...");
          
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            // this is wrong, should propogate via a component
            document.body.appendChild(video);
            stream.getTracks().forEach((track) => {
                pc?.addTrack(track);
            });
        });
    }

  return (
    <div>  
      <div>Sender</div>
      <button onClick={startSendingVideo}>Send Video</button>
    </div>
  )
}

export default Sender