import React, { useContext } from "react";
import { Message } from "../../types/chat";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { ChatContext } from "../../context/ChatContext";

const Chat: React.FC = () => {
  const { chat } = useContext(ChatContext);

  return (
    <div className="flex flex-col h-[82vh] justify-between ">
      <div className="overflow-y-scroll">
        {chat.messages.map((message: Message) => (
          <ChatBubble
            message={message}
            key={message.timestamp + (message?.author || "anonymous")}
          />
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default Chat;
