import { User } from "../types/user";

const PEER_ACTIONS = {
  ADD_PEER_NAME: "ADD_PEER_NAME" as const,
  ADD_PEER_STREAM: "ADD_PEER_STREAM" as const,
  REMOVE_PEER_STREAM: "REMOVE_PEER_STREAM" as const,
  ADD_ALL_PEERS: "ADD_ALL_PEERS" as const,
};

export const {
  ADD_PEER_NAME,
  REMOVE_PEER_STREAM,
  ADD_PEER_STREAM,
  ADD_ALL_PEERS,
} = PEER_ACTIONS;

export const addPeerStreamAction = (peerId: string, stream: MediaStream) => ({
  type: ADD_PEER_STREAM,
  payload: { peerId, stream },
});
export const addPeerNameAction = (peerId: string, userName: string) => ({
  type: ADD_PEER_NAME,
  payload: { peerId, userName },
});
export const removePeerStreamAction = (peerId: string) => ({
  type: REMOVE_PEER_STREAM,
  payload: { peerId },
});

export const addAllPeersAction = (peers: Record<string, User>) => ({
  type: ADD_ALL_PEERS,
  payload: { peers },
});
