import { Server } from "http";
import WebSocket, { WebSocketServer } from "ws";

let wss: WebSocketServer | null = null;

export function attachWebSocketServer(server: Server): void {
    wss = new WebSocketServer({ server, path: "/ws" });

    wss.on("connection", (socket) => {
        socket.send(JSON.stringify({ type: "connected" }));
    });
}

export function broadcastServiceStatus(id: string, status: string): void {
    if (!wss) return;

    const message = JSON.stringify({ id, status });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}
