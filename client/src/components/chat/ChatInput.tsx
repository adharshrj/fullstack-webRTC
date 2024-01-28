import React, { useContext, useState } from "react";
import { Button } from "../common/Button";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { ChatContext } from "../../context/ChatContext";
import { UserContext } from "../../context/UserContext";
import { RoomContext } from "../../context/RoomContext";
const ChatInput: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const { sendMessage } = useContext(ChatContext);
  const { userId } = useContext(UserContext);
  const { roomId } = useContext(RoomContext);

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (message.length === 0) return;
    sendMessage(message, roomId, userId);
    setMessage("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex m-2">
          <textarea
            className="border rounded"
            onChange={handleChange}
            value={message}
          />
          <Button
            disabled={message.length === 0}
            className="mx-2"
            type="submit"
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
