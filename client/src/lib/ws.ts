import socketIOClient from "socket.io-client";
const URL = import.meta.env.SERVER_URL || "http://localhost:8080";
export const ws = socketIOClient(URL);
