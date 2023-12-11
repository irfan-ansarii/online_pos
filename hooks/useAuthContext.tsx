import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "./useAuth";

// Define the type for your session context
interface SessionContextProps {
  session: any; // replace 'any' with your actual session data type
  loading: boolean;
}

// Initialize the context with null
const SessionContext = createContext<SessionContextProps | null>(null);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: session, isLoading } = useSession();

  return (
    <SessionContext.Provider
      value={{
        session: session?.data?.data,
        loading: isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a SessionProvider");
  }
  return context;
};
