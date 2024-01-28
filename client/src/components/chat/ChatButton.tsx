import { Button } from "../common/Button";

import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
const ChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button className="p-4 mx-2" onClick={onClick}>
      <ChatBubbleLeftRightIcon className="h-6 w-6" />
    </Button>
  );
};

export default ChatButton;
