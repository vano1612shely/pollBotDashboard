"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { SERVER_URL } from "@/services/api";

interface SocketContextProps {
  socket: Socket;
}
const SocketContext = createContext<SocketContextProps>(null!);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socketIo = io(SERVER_URL as string);
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);
  if (socket)
    return (
      <SocketContext.Provider value={{ socket: socket as Socket }}>
        {children}
      </SocketContext.Provider>
    );
};
