import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

type User = {
  peerId: string;
  userName: string;
};

type RoomParams = {
  roomId: string;
  peerId: string;
};

type JoinRoomParams = RoomParams & {
  userName: string;
};

type Message = {
  content: string;
  author?: string;
  timestamp: number;
};

const rooms: Record<string, Record<string, User>> = {};
const chats: Record<string, Message[]> = {};

export default function roomHandler(socket: Socket) {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = {};
    socket.emit("room-created", { roomId });
    console.log("user created the room");
  };
  const joinRoom = ({ roomId, peerId, userName }: JoinRoomParams) => {
    if (!rooms[roomId]) rooms[roomId] = {};
    if (!chats[roomId]) chats[roomId] = [];
    socket.emit("get-messages", chats[roomId]);
    console.log("user joined the room", roomId, peerId, userName);
    rooms[roomId][peerId] = { peerId, userName };
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { peerId, userName });
    socket.emit("get-users", {
      roomId,
      participants: rooms[roomId],
    });

    socket.on("disconnect", () => {
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ peerId, roomId }: RoomParams) => {
    console.log("user disconnected", { roomId, peerId });
    socket.to(roomId).emit("user-disconnected", peerId);
  };

  const startSharing = ({ peerId, roomId }: RoomParams) => {
    console.log("user started sharing", { roomId, peerId });
    socket.to(roomId).emit("user-started-sharing", peerId);
  };

  const stopSharing = (roomId: string) => {
    console.log("user stopped sharing");
    socket.to(roomId).emit("user-stopped-sharing");
  };

  const addMessage = (roomId: string, message: Message) => {
    console.log({ message });
    if (chats[roomId]) {
      chats[roomId].push(message);
    } else {
      chats[roomId] = [message];
    }
    socket.to(roomId).emit("add-message", message);
  };

  const changeName = ({
    peerId,
    userName,
    roomId,
  }: {
    peerId: string;
    userName: string;
    roomId: string;
  }) => {
    if (rooms[roomId] && rooms[roomId][peerId]) {
      rooms[roomId][peerId].userName = userName;
      socket.to(roomId).emit("name-changed", { peerId, userName });
    }
  };
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
  socket.on("send-message", addMessage);
  socket.on("change-name", changeName);
}
