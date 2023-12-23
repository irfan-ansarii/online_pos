import React, { createContext, useContext, ReactNode } from "react";

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
  return (
    <SessionContext.Provider
      value={{
        session: null,
        loading: false,
        locations: null,
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
