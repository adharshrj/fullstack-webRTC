import { Button } from "../common/Button";

import { XCircleIcon } from "@heroicons/react/24/solid";
const ExitButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button className="p-4 mx-2" onClick={onClick}>
      <XCircleIcon className="h-6 w-6" />
    </Button>
  );
};

export default ExitButton;
