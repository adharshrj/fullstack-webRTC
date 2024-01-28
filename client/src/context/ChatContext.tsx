import React, { createContext, ReactNode, useEffect, useReducer } from "react";
import { ws } from "../lib/ws";

import { Message } from "../types/chat";
import { chatReducer, ChatState } from "../reducers/chatReducer";
import {
  addHistoryAction,
  addMessageAction,
  toggleChatAction,
} from "../reducers/chatActions";

type ChatProviderProps = {
  children: ReactNode;
};

type ChatValue = {
  chat: ChatState;
  sendMessage: (message: string, roomId: string, author: string) => void;
  toggleChat: () => void;
};

export const ChatContext = createContext<ChatValue>({
  chat: {
    messages: [],
    isChatOpen: false,
  },
  sendMessage: () => {},
  toggleChat: () => {},
});

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: [],
    isChatOpen: false,
  });

  const sendMessage = (message: string, roomId: string, author: string) => {
    const messageData: Message = {
      content: message,
      timestamp: new Date().getTime(),
      author: author,
    };
    chatDispatch(addMessageAction(messageData));
    ws.emit("send-message", roomId, messageData);
  };

  const addMessage = (message: Message) => {
    chatDispatch(addMessageAction(message));
  };

  const addHistory = (messages: Message[]) => {
    chatDispatch(addHistoryAction(messages));
  };

  const toggleChat = () => {
    chatDispatch(toggleChatAction(!chat.isChatOpen));
  };
  useEffect(() => {
    ws.on("add-message", addMessage);
    ws.on("get-messages", addHistory);
    return () => {
      ws.off("add-message", addMessage);
      ws.off("get-messages", addHistory);
    };
  }, []);

  return (
    <ChatContext.Provider value={{ chat, sendMessage, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
