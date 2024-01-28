import { PeerServer } from "peer";

PeerServer({ port: 9001, path: "/" });

let peerServer;

if (!peerServer) peerServer = PeerServer({ port: 9001, path: "/" });

// Log events
peerServer.on("connection", (client) => {
  console.log(`New connection: ${client.getId()}`);
});

peerServer.on("disconnect", (client) => {
  console.log(`Disconnected: ${client.getId()}`);
});

peerServer.on("error", (error) => {
  console.log(`PeerServer error: ${error.message}`);
});
