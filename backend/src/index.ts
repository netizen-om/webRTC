import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port : 3001 })

wss.on("connection", (ws) => {
    ws.on("error", (error) => console.log(error))

    ws.on("message", (data : any) => {
        const msg = JSON.parse(data);
    })
})