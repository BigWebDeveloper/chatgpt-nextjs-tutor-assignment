"use client";
import { StoreContextType } from "../types/storeContext";
import { createContext, useContext, useState, ReactNode } from "react";

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isLoginPopup, setIsLoginPopup] = useState<boolean>(false);

  // Helper functions for cleaner usage
  const openLogin = () => setIsLoginPopup(true);
  const closeLogin = () => setIsLoginPopup(false);

  return (
    <StoreContext.Provider
      value={{
        isLoginPopup,
        setIsLoginPopup,
        openLogin,
        closeLogin,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook to consume the StoreContext easily
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
