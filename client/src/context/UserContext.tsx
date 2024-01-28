import { createContext, useEffect, useState, ReactNode } from "react";
import { v4 as uuidV4 } from "uuid";

type UserValue = {
  userId: string;
  userName: string;
  setUserName: (userName: string) => void;
};

type UserProviderProps = {
  children: ReactNode;
};

export const UserContext = createContext<UserValue>({
  userId: "",
  userName: "",
  setUserName: () => {},
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId] = useState(localStorage.getItem("userId") || uuidV4());
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};
