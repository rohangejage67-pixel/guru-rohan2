// frontend/src/components/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env ? import.meta.env.VITE_REACT_APP_SOCKET_URL || "https://guru-rohan2.onrender.com" : "https://guru-rohan2.onrender.com";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});
// console.log("🔗 Connecting to socket URL:", SOCKET_URL);

export default socket;
