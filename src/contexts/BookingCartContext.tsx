import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { emptyGuestInfo, type CartLeg, type GuestInfo } from "../lib/cartTypes";

const STORAGE_KEY = "lhg_booking_cart";

interface StoredCart {
  legs: CartLeg[];
  guestInfo: GuestInfo;
  lastHotel: string;
}

function loadStoredCart(): StoredCart {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupt/blocked storage, fall back to empty cart
  }
  return { legs: [], guestInfo: emptyGuestInfo, lastHotel: "" };
}

interface BookingCartContextValue {
  legs: CartLeg[];
  guestInfo: GuestInfo;
  lastHotel: string;
  totalPrice: number;
  addLeg: (leg: CartLeg) => void;
  removeLeg: (id: string) => void;
  updateGuestInfo: (info: Partial<GuestInfo>) => void;
  setLastHotel: (hotel: string) => void;
  clearCart: () => void;
}

const BookingCartContext = createContext<BookingCartContextValue | undefined>(undefined);

export function useBookingCart() {
  const ctx = useContext(BookingCartContext);
  if (!ctx) throw new Error("useBookingCart must be used within a BookingCartProvider");
  return ctx;
}

export function BookingCartProvider({ children }: { children: ReactNode }) {
  const [legs, setLegs] = useState<CartLeg[]>(() => loadStoredCart().legs);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>(() => loadStoredCart().guestInfo);
  const [lastHotel, setLastHotelState] = useState<string>(() => loadStoredCart().lastHotel);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ legs, guestInfo, lastHotel }));
    } catch {
      // storage unavailable (private browsing, etc.) — cart just won't survive a refresh
    }
  }, [legs, guestInfo, lastHotel]);

  const addLeg = (leg: CartLeg) => setLegs((prev) => [...prev, leg]);
  const removeLeg = (id: string) => setLegs((prev) => prev.filter((l) => l.id !== id));
  const updateGuestInfo = (info: Partial<GuestInfo>) => setGuestInfo((prev) => ({ ...prev, ...info }));
  const setLastHotel = (hotel: string) => setLastHotelState(hotel);
  const clearCart = () => {
    setLegs([]);
    setGuestInfo(emptyGuestInfo);
    setLastHotelState("");
  };

  const totalPrice = legs.reduce((sum, leg) => sum + (leg.totalPrice || 0), 0);

  return (
    <BookingCartContext.Provider
      value={{ legs, guestInfo, lastHotel, totalPrice, addLeg, removeLeg, updateGuestInfo, setLastHotel, clearCart }}
    >
      {children}
    </BookingCartContext.Provider>
  );
}
