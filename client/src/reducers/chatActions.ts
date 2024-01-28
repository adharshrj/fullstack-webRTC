import { Message } from "../types/chat";

const MESSAGE_ACTIONS = {
  ADD_MESSAGE: "ADD_MESSAGE" as const,
  ADD_HISTORY: "ADD_HISTORY" as const,
  TOGGLE_CHAT: "TOGGLE_CHAT" as const,
};

export const { ADD_HISTORY, ADD_MESSAGE, TOGGLE_CHAT } = MESSAGE_ACTIONS;

export const addMessageAction = (message: Message) => ({
  type: ADD_MESSAGE,
  payload: { message },
});

export const addHistoryAction = (history: Message[]) => ({
  type: ADD_HISTORY,
  payload: { history },
});

export const toggleChatAction = (isOpen: boolean) => ({
  type: TOGGLE_CHAT,
  payload: { isOpen },
});
