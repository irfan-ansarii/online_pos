import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "./useAuth";
import { useLocations } from "./useUser";

// Define the type for your session context
interface SessionContextProps {
  session: any;
  loading: boolean;
  locations: any;
}

// Initialize the context with null
const SessionContext = createContext<SessionContextProps | null>(null);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: session, isLoading } = useSession();
  const { data: locations } = useLocations();

  return (
    <SessionContext.Provider
      value={{
        session: session?.data?.data,
        loading: isLoading,
        locations: locations?.data?.data,
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
