import { io } from "socket.io-client";
import { SOCKET_URL } from "../config";

// Create a single socket instance for the whole app
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"], // better performance
  autoConnect: false, // will connect manually
});

export default socket;
