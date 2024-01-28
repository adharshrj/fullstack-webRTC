import React, {
  createContext,
  ReactNode,
  useEffect,
  useCallback,
  useState,
  useReducer,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";

import Peer from "peerjs";
import { ws } from "../lib/ws";
import { v4 as uuidV4 } from "uuid";
import { PeerState, peerReducer } from "../reducers/peerReducer";
import {
  addAllPeersAction,
  addPeerNameAction,
  addPeerStreamAction,
  removePeerStreamAction,
} from "../reducers/peerActions";
import { UserContext } from "./UserContext";
import { User } from "../types/user";

type RoomProviderProps = {
  children: ReactNode;
};

type RoomValue = {
  me?: Peer;
  stream?: MediaStream;
  screenStream?: MediaStream;
  exitRoom?: () => void;
  peers: PeerState;
  shareScreen: () => void;
  roomId: string;
  setRoomId: (id: string) => void;
  screenSharingId: string;
};

type Connection = {
  peerConnection: RTCPeerConnection;
};

export const RoomContext = createContext<RoomValue>({
  peers: {},
  shareScreen: () => {},
  setRoomId: () => {},
  screenSharingId: "",
  roomId: "",
});

const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { userName } = useContext(UserContext);
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [screenStream, setScreenStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peerReducer, {});
  const [screenSharingId, setScreenSharingId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const enterRoom = useCallback(
    ({ roomId }: { roomId: "string" }) => {
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );
  const getUsers = ({
    participants,
  }: {
    participants: Record<string, User>;
  }) => {
    console.log({ participants });
    dispatch(addAllPeersAction(participants));
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerStreamAction(peerId));
  };

  const exitRoom = () => {
    navigate("/");
  };

  const switchStream = (stream: MediaStream | undefined) => {
    setScreenSharingId(me?.id || "");

    if (me?.connections) {
      Object.values(me.connections).forEach((connection: Connection[]) => {
        const videoTrack: MediaStreamTrack | undefined = stream
          ?.getTracks()
          .find((track) => track.kind === "video");

        if (videoTrack) {
          const videoSender = connection[0].peerConnection
            .getSenders()
            .find((sender: RTCRtpSender) => sender.track?.kind === "video");

          if (videoSender) {
            videoSender
              .replaceTrack(videoTrack)
              .catch((err: Error) => console.error(err));
          }
        }
      });
    }
  };

  const shareScreen = () => {
    if (screenSharingId) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(switchStream);
    } else {
      navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
        switchStream(stream);
        setScreenStream(stream);
      });
    }
  };

  const nameChangedHandler = ({
    peerId,
    userName,
  }: {
    peerId: string;
    userName: string;
  }) => {
    dispatch(addPeerNameAction(peerId, userName));
  };

  useEffect(() => {
    const meID = uuidV4();
    const peer = new Peer(meID, {
      host: "localhost",
      port: 9001,
      path: "/",
    });
    setMe(peer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }

    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
    ws.on("user-started-sharing", (peerId) => setScreenSharingId(peerId));
    ws.on("user-stopped-sharing", () => setScreenSharingId(""));
    ws.on("name-changed", nameChangedHandler);

    return () => {
      ws.off("room-created");
      ws.off("get-users");
      ws.off("user-disconnected");
      ws.off("user-started-sharing");
      ws.off("user-stopped-sharing");
      ws.off("user-joined");
      ws.off("name-changed");
    };
  }, [enterRoom]);

  useEffect(() => {
    if (screenSharingId) {
      ws.emit("start-sharing", { peerId: screenSharingId, roomId });
    } else {
      ws.emit("stop-sharing");
    }
  }, [roomId, screenSharingId]);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;
    ws.on("user-joined", ({ peerId, userName: name }) => {
      const call = me.call(peerId, stream, {
        metadata: {
          userName,
        },
      });
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(peerId, peerStream));
      });
      dispatch(addPeerNameAction(peerId, name));
    });

    me.on("call", (call) => {
      const { userName } = call.metadata;
      dispatch(addPeerNameAction(call.peer, userName));
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });
    });

    return () => {
      ws.off("user-joined");
    };
  }, [me, stream, userName]);

  return (
    <RoomContext.Provider
      value={{
        me,
        stream,
        screenStream,
        peers,
        shareScreen,
        roomId,
        setRoomId,
        screenSharingId,
        exitRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
