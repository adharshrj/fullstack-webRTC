import classNames from "classnames";
import { ReactNode } from "react";

type ButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  className: string;
  testId?: string;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
};
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  testId,
  className,
  disabled,
  type = "submit",
}) => {
  return (
    <button
      type={type}
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        "bg-rose-400",
        "p-2",
        "rounded-lg",
        "text-white",
        {
          "hover:bg-rose-600": !disabled,
        },
        className
      )}
    >
      {children}
    </button>
  );
};
