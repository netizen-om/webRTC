import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port : 3001 })

let senderSocket: null | WebSocket = null;
let reciverSocket: null | WebSocket = null;

wss.on("connection", (ws) => {
    console.log("Connected to WS server");
    
    ws.on("error", (error) => console.log(error))

    ws.on("message", (data : any) => {
        const messgae = JSON.parse(data);
        
        if(messgae.type === "sender"){
            senderSocket = ws;
        } else if(messgae.type === "reciver") {
            reciverSocket = ws;
        } else if(messgae.type === "offer") {
            reciverSocket?.send(
                JSON.stringify({
                    type: "offer",
                    offer : messgae.offer
                })
            )
        } else if(messgae.type === "answer") {
            senderSocket?.send(
                JSON.stringify({
                    type: "offer",
                    offer : messgae.offer
                })
            )
        }
        
    })
})