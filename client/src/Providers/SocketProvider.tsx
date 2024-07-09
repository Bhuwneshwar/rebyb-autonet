import {
  createContext,
  useMemo,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socket = useMemo(
    () =>
      io("http://localhost:5000", {
        // transports: ["websocket"]
        withCredentials: true,
      }),
    []
  );

  useEffect(() => {
    // Cleanup the socket when the component unmounts
    return () => {
      socket && socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
