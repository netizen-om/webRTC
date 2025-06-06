import React, { useEffect, useState } from 'react';

function Sender() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "sender" }));
      setSocket(ws);
    };
  }, []);

  const startSendingVideo = async () => {
    if (!socket) return;

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    setPc(peer);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    stream.getTracks().forEach(track => {
      peer.addTrack(track, stream);
    });

    peer.onnegotiationneeded = async () => {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.send(JSON.stringify({ type: "createOffer", sdp: peer.localDescription }));
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }));
      }
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "answer") {
        await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
      } else if (data.type === "iceCandidate") {
        await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };
  };

  return (
    <div>
      <div>Sender</div>
      <button onClick={startSendingVideo}>Start Video</button>
    </div>
  );
}

export default Sender;
