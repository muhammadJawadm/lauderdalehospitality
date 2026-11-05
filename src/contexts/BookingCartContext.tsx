import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { emptyGuestInfo, type CartLeg, type GuestInfo } from "../lib/cartTypes";
import { useAuth } from "./AuthContext";

const STORAGE_KEY = "lhg_booking_cart";

interface StoredCart {
  legs: CartLeg[];
  guestInfo: GuestInfo;
  lastHotel: string;
  lastCruise: { cruiseLine: string; cruiseShip: string; cruisePort: string };
}

function loadStoredCart(): StoredCart {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupt/blocked storage, fall back to empty cart
  }
  return { legs: [], guestInfo: emptyGuestInfo, lastHotel: "", lastCruise: { cruiseLine: "", cruiseShip: "", cruisePort: "" } };
}

interface BookingCartContextValue {
  legs: CartLeg[];
  guestInfo: GuestInfo;
  lastHotel: string;
  lastCruise: { cruiseLine: string; cruiseShip: string; cruisePort: string };
  lastPassengers: string;
  totalPrice: number;
  addLeg: (leg: CartLeg) => void;
  removeLeg: (id: string) => void;
  updateLeg: (id: string, updated: CartLeg) => void;
  updateGuestInfo: (info: Partial<GuestInfo>) => void;
  setLastHotel: (hotel: string) => void;
  setLastCruise: (cruise: { cruiseLine: string; cruiseShip: string; cruisePort: string }) => void;
  clearCart: () => void;
}

const BookingCartContext = createContext<BookingCartContextValue | undefined>(undefined);

export function useBookingCart() {
  const ctx = useContext(BookingCartContext);
  if (!ctx) throw new Error("useBookingCart must be used within a BookingCartProvider");
  return ctx;
}

export function BookingCartProvider({ children }: { children: ReactNode }) {
  const { users } = useAuth();
  const [legs, setLegs] = useState<CartLeg[]>(() => loadStoredCart().legs);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>(() => loadStoredCart().guestInfo);
  const [lastHotel, setLastHotelState] = useState<string>(() => loadStoredCart().lastHotel);
  const [lastCruise, setLastCruiseState] = useState(() => loadStoredCart().lastCruise);

  useEffect(() => {
    if (users && !guestInfo.fName && !guestInfo.email) {
      setGuestInfo({
        fName: users.fName || "",
        lName: users.lName || "",
        email: users.email || "",
        phone: users.phone || "",
      });
    }
  }, [users]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ legs, guestInfo, lastHotel, lastCruise }));
    } catch {
      // storage unavailable (private browsing, etc.)
    }
  }, [legs, guestInfo, lastHotel, lastCruise]);

  const addLeg = (leg: CartLeg) => setLegs((prev) => [...prev, leg]);
  const removeLeg = (id: string) => setLegs((prev) => prev.filter((l) => l.id !== id));
  const updateLeg = (id: string, updated: CartLeg) => setLegs((prev) => prev.map((l) => (l.id === id ? updated : l)));
  const updateGuestInfo = (info: Partial<GuestInfo>) => setGuestInfo((prev) => ({ ...prev, ...info }));
  const setLastHotel = (hotel: string) => setLastHotelState(hotel);
  const setLastCruise = (cruise: { cruiseLine: string; cruiseShip: string; cruisePort: string }) => setLastCruiseState(cruise);
  const clearCart = () => {
    setLegs([]);
    setGuestInfo(emptyGuestInfo);
    setLastHotelState("");
    setLastCruiseState({ cruiseLine: "", cruiseShip: "", cruisePort: "" });
  };

  const totalPrice = legs.reduce((sum, leg) => sum + (leg.totalPrice || 0), 0);
  const lastPassengers = legs.length > 0 ? legs[legs.length - 1].adults : "2";

  return (
    <BookingCartContext.Provider
      value={{ legs, guestInfo, lastHotel, lastCruise, lastPassengers, totalPrice, addLeg, removeLeg, updateLeg, updateGuestInfo, setLastHotel, setLastCruise, clearCart }}
    >
      {children}
    </BookingCartContext.Provider>
  );
}
