import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import ShareScreenButton from "../components/ShareScreen";
import ChatButton from "../components/chat/ChatButton";
import VideoPlayer from "../components/VideoPlayer";
import { PeerState } from "../reducers/peerReducer";
import { RoomContext } from "../context/RoomContext";
import Chat from "../components/chat/Chat";
import { NameInput } from "../common/UserName";
import { ws } from "../lib/ws";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";

const Room: React.FC = () => {
  const { id } = useParams();
  const {
    stream,
    screenStream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
  } = useContext(RoomContext);
  const { userName, userId } = useContext(UserContext);
  const { toggleChat, chat } = useContext(ChatContext);

  useEffect(() => {
    if (stream) ws.emit("join-room", { roomId: id, peerId: userId, userName });
  }, [id, userId, stream, userName]);

  useEffect(() => {
    setRoomId(id || "");
  }, [id, setRoomId]);

  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

  const peersToShow = Object.fromEntries(
    Object.entries(peers).filter(([key]) => key !== screenSharingId)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-red-500 p-4 text-white">Room ID : {id}</div>
      <div className="flex grow">
        {screenSharingVideo && (
          <div className="w-4/5 pr-4">
            <VideoPlayer stream={screenSharingVideo} />
          </div>
        )}
        <div
          className={`grid gap-4 ${
            screenSharingVideo ? "w-1/5 grid-col-1" : "grid-cols-4"
          }`}
        >
          {screenSharingId !== userId && (
            <div className="p-2">
              <VideoPlayer stream={stream} />
              <NameInput />
            </div>
          )}

          {Object.values(peersToShow as PeerState)
            .filter((peer) => !!peer.stream)
            .map((peer) => (
              <div key={peer.peerId}>
                <VideoPlayer stream={peer.stream} />
                <div>{peer.userName}</div>
              </div>
            ))}
        </div>
        {chat.isChatOpen && (
          <div className="border-l-2 pb-28">
            <Chat />
          </div>
        )}
      </div>
      <div className="h-28 fixed bottom-0 p-6 w-full flex items-center justify-center border-t-2 bg-white">
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
      </div>
    </div>
  );
};

export default Room;
