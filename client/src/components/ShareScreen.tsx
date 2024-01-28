import { Button } from "./common/Button";

import { ComputerDesktopIcon } from "@heroicons/react/24/solid";

const ShareScreenButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button className="p-4 mx-2" onClick={onClick}>
      <ComputerDesktopIcon className="h-6 w-6" />
    </Button>
  );
};

export default ShareScreenButton;
