"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { findCable } from "@/lib/quote/catalog";
import { CableSheetModal } from "./CableSheetModal";

interface CableSheetContextValue {
  /** Id of the cable whose technical sheet is open, or null. */
  openCableId: string | null;
  /** Opens the technical sheet; unknown ids are ignored. */
  open: (cableId: string) => void;
  close: () => void;
}

const CableSheetContext = createContext<CableSheetContextValue | null>(null);

export function useCableSheet(): CableSheetContextValue {
  const value = useContext(CableSheetContext);
  if (!value)
    throw new Error("useCableSheet must be used inside <CableSheetProvider>");
  return value;
}

/** Mount once in the root layout (inside QuoteProvider) so any section can open a sheet. */
export function CableSheetProvider({ children }: { children: ReactNode }) {
  const [openCableId, setOpenCableId] = useState<string | null>(null);

  const open = useCallback((cableId: string) => {
    if (findCable(cableId)) setOpenCableId(cableId);
  }, []);
  const close = useCallback(() => setOpenCableId(null), []);

  const value = useMemo(
    () => ({ openCableId, open, close }),
    [openCableId, open, close],
  );

  return (
    <CableSheetContext.Provider value={value}>
      {children}
      {openCableId && (
        <CableSheetModal
          key={openCableId}
          cableId={openCableId}
          onClose={close}
        />
      )}
    </CableSheetContext.Provider>
  );
}
