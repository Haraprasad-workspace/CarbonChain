import { io } from "socket.io-client";
import { getUser } from "../utils/storage";

const user = getUser();

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
    autoConnect: true,
    auth: {
        userId: user?._id
    }
});

export default socket;