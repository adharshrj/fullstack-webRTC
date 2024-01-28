import React, { useContext } from "react";
import { ws } from "../lib/ws";
import { NameInput } from "../common/UserName";
import { Button } from "./common/Button";
import VideoPlayer from "./VideoPlayer";
import { RoomContext } from "../context/RoomContext";

const Join: React.FC = () => {
  const { stream } = useContext(RoomContext);
  const CreateRoom = () => {
    ws.emit("create-room");
  };
  return (
    <div>
      <VideoPlayer stream={stream} />
      <div className="flex flex-col">
        <NameInput />
        <Button
          onClick={CreateRoom}
          className="rounded-lg py-2 px-6 bg-teal-500 hover:bg-teal-600 text-white"
        >
          Start New Meeting
        </Button>
      </div>
    </div>
  );
};

export default Join;
