import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port : 3001 })

let senderSocket: null | WebSocket = null;
let reciverSocket: null | WebSocket = null;

wss.on("connection", (ws) => {
    // console.log("Connected to WS ");
    
    ws.on("error", (error) => console.log(error))

    ws.on("message", (data : any) => {
        const messgae = JSON.parse(data);
        
        if(messgae.type === "sender"){
            console.log("Sender set");
            
            senderSocket = ws;
        } else if(messgae.type === "receiver") {
            console.log("Receiver set");
            reciverSocket = ws;
        } else if(messgae.type === "createOffer") {
            console.log("Creating offer");
            
            reciverSocket?.send(
                JSON.stringify({
                    type: "createOffer",
                    sdp : messgae.sdp
                })
            )
        } else if(messgae.type === "answer") {
            console.log("Answer received from receiver");
            
            senderSocket?.send(
                JSON.stringify({
                    type: "answer",
                    sdp: messgae.sdp
                })
            )
        }
        
    })
})