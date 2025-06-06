import React, { useEffect, useRef, useState } from 'react';

function Receiver() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "receiver" }));
      setSocket(ws);
    };

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "createOffer") {
        const peer = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        pcRef.current = peer;

        peer.onicecandidate = (event) => {
          if (event.candidate) {
            ws.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }));
          }
        };

        peer.ontrack = (event) => {
          console.log("Track received:", event.track);
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
          }
        };

        await peer.setRemoteDescription(new RTCSessionDescription(message.sdp));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        ws.send(JSON.stringify({ type: "answer", sdp: peer.localDescription }));
      }

      if (message.type === "iceCandidate" && pcRef.current) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(message.candidate));
      }
    };
  }, []);

  return (
    <div>
      <div>Receiver</div>
      <video ref={videoRef} autoPlay muted playsInline height={300}></video>

    </div>
  );
}

export default Receiver;
