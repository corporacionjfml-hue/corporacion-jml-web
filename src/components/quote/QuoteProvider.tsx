"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { findCable } from "@/lib/quote/catalog";
import { addManyItems, removeItem, upsertItem } from "@/lib/quote/items";
import {
  EMPTY_QUOTE,
  parseStoredQuote,
  QUOTE_STORAGE_KEY,
  serializeQuote,
} from "@/lib/quote/storage";
import type { BuyerType, QuoteItem } from "@/lib/quote/types";
import { QuantityModal } from "./QuantityModal";
import { QuoteTray } from "./QuoteTray";

interface QuoteContextValue {
  items: QuoteItem[];
  count: number;
  buyerType: BuyerType | null;
  setBuyerType: (buyerType: BuyerType | null) => void;
  /** Cable currently shown in the quantity modal, or null when closed. */
  modalCableId: string | null;
  openQuantity: (cableId: string) => void;
  closeQuantity: () => void;
  /** Adds the cable or updates its quantity (normalized). */
  setQuantity: (cableId: string, quantity: number) => void;
  remove: (cableId: string) => void;
  clear: () => void;
  /** Adds cables with their default quantity, skipping the ones already present. */
  addMany: (cableIds: string[]) => void;
  hasItem: (cableId: string) => boolean;
  trayVisible: boolean;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuote(): QuoteContextValue {
  const value = useContext(QuoteContext);
  if (!value) throw new Error("useQuote must be used inside <QuoteProvider>");
  return value;
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>(EMPTY_QUOTE.items);
  const [buyerType, setBuyerType] = useState<BuyerType | null>(EMPTY_QUOTE.buyerType);
  const [hydrated, setHydrated] = useState(false);
  const [modalCableId, setModalCableId] = useState<string | null>(null);
  // Mockup `qTouched`: the tray only shows after the user adds something in this visit.
  const [touched, setTouched] = useState(false);

  // Hydrate after mount so server and first client render match.
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(QUOTE_STORAGE_KEY);
    } catch {
      // Storage blocked: start empty.
    }
    const stored = parseStoredQuote(raw);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from localStorage */
    setItems(stored.items);
    setBuyerType(stored.buyerType);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(QUOTE_STORAGE_KEY, serializeQuote({ items, buyerType }));
    } catch {
      // Storage full or blocked: keep working in memory.
    }
  }, [hydrated, items, buyerType]);

  const openQuantity = useCallback((cableId: string) => {
    if (findCable(cableId)) setModalCableId(cableId);
  }, []);
  const closeQuantity = useCallback(() => setModalCableId(null), []);

  const setQuantity = useCallback((cableId: string, quantity: number) => {
    setItems((prev) => upsertItem(prev, cableId, quantity));
    setTouched(true);
  }, []);
  const remove = useCallback((cableId: string) => {
    setItems((prev) => removeItem(prev, cableId));
  }, []);
  const clear = useCallback(() => setItems([]), []);
  const addMany = useCallback((cableIds: string[]) => {
    setItems((prev) => addManyItems(prev, cableIds));
    setTouched(true);
  }, []);
  const hasItem = useCallback(
    (cableId: string) => items.some((item) => item.cableId === cableId),
    [items],
  );

  const trayVisible = hydrated && touched && items.length > 0 && modalCableId === null;

  const value = useMemo<QuoteContextValue>(
    () => ({
      items,
      count: items.length,
      buyerType,
      setBuyerType,
      modalCableId,
      openQuantity,
      closeQuantity,
      setQuantity,
      remove,
      clear,
      addMany,
      hasItem,
      trayVisible,
    }),
    [
      items,
      buyerType,
      modalCableId,
      openQuantity,
      closeQuantity,
      setQuantity,
      remove,
      clear,
      addMany,
      hasItem,
      trayVisible,
    ],
  );

  return (
    <QuoteContext.Provider value={value}>
      {children}
      <QuantityModal />
      <QuoteTray />
    </QuoteContext.Provider>
  );
}
