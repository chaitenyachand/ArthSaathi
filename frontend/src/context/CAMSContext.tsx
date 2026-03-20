import { createContext, useContext, ReactNode } from "react";
import { useCAMSData } from "@/hooks/useCAMSData";

type CAMSContextType = ReturnType<typeof useCAMSData>;

const CAMSContext = createContext<CAMSContextType | null>(null);

export const CAMSProvider = ({ children }: { children: ReactNode }) => {
  const cams = useCAMSData();
  return <CAMSContext.Provider value={cams}>{children}</CAMSContext.Provider>;
};

export const useCAMS = (): CAMSContextType => {
  const ctx = useContext(CAMSContext);
  if (!ctx) throw new Error("useCAMS must be used within CAMSProvider");
  return ctx;
};