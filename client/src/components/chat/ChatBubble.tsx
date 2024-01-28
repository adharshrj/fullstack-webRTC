import { useContext } from "react";
import { Message } from "../../types/chat";
import { RoomContext } from "../../context/RoomContext";
import classNames from "classnames";
import { UserContext } from "../../context/UserContext";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
  const { peers } = useContext(RoomContext);
  const { userId } = useContext(UserContext);
  const isSelf = message.author === userId;
  const author =
    (message.author && peers[message.author].userName) || "Unknown";
  const time = new Date(message.timestamp).toLocaleTimeString();

  const AuthorSpan = () => {
    return (
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {author}
      </span>
    );
  };

  const TimeSpan = () => {
    function formatTime(timeString: string) {
      const [hours, minutes] = timeString.split(":").map(Number);

      const formattedTimeString = `${hours % 12}:${
        minutes < 10 ? "0" : ""
      }${minutes}`;

      return formattedTimeString;
    }

    return (
      <span className="text-xs font-normal text-gray-500 dark:text-gray-400 flex justify-end">
        {formatTime(time)}
      </span>
    );
  };

  return (
    <div
      className={classNames("flex items-start gap-2.5 p-2", {
        "pl-10 justify-end": isSelf,
        "justify-start": !isSelf,
      })}
    >
      {!isSelf && (
        <div className="w-6 h-6">
          <UserCircleIcon />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <div
          className={classNames(
            "flex flex-col w-full max-w-[500px] leading-1.5 p-4 border-gray-200 bg-gray-100 ",
            {
              "rounded-e-xl rounded-es-xl  dark:bg-gray-500": !isSelf,
              "rounded-s-xl rounded-ee-xl  dark:bg-red-700": isSelf,
            }
          )}
        >
          <div
            className={classNames("flex items-center mb-2", {
              "justify-end": isSelf,
              "justify-start": !isSelf,
            })}
          >
            <AuthorSpan />
          </div>
          <p
            className={classNames(
              "text-sm font-normal text-gray-900 dark:text-white",
              {
                "justify-end": isSelf,
                "justify-start": !isSelf,
              }
            )}
          >
            {message.content}
          </p>
          <span
            className={classNames(
              "flex text-xs py-2 font-normal text-gray-500 dark:text-gray-400",
              {
                "justify-end": isSelf,
                "justify-start": !isSelf,
              }
            )}
          >
            Delivered
          </span>
          <TimeSpan />
        </div>
      </div>
      {isSelf && (
        <div className="w-6 h-6">
          <UserCircleIcon />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
