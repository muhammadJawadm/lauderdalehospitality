export interface GuestInfo {
  fName: string;
  lName: string;
  email: string;
  phone: string;
}

export const emptyGuestInfo: GuestInfo = { fName: "", lName: "", email: "", phone: "" };

interface BaseLeg {
  id: string;
  pickupLoc: string;
  dropoffLoc: string;
  adults: string;
  comments: string;
  perPersonPrice: number;
  totalPrice: number;
}

export interface AirportLeg extends BaseLeg {
  legType: "airport";
  bookingType: "AS" | "AP";
  pickupDate: string;
  pickupTime: string;
  transferType: string;
  airline: string;
  flightNum: string;
  arrival: string;
}

export interface CruiseLeg extends BaseLeg {
  legType: "cruise";
  bookingType: "CS" | "CP";
  cruiseDate: string;
  cruiseLine: string;
  cruiseShip: string;
  departureTime: string;
  returnTrip: boolean;
  transferType: string;
}

export interface PostCruiseAirportLeg extends BaseLeg {
  legType: "post-cruise-airport";
  cruiseShip: string;
  airline: string;
}

export interface PostCruiseHotelLeg extends BaseLeg {
  legType: "post-cruise-hotel";
  cruiseShip: string;
}

export interface DepartureLeg extends BaseLeg {
  legType: "departure";
  departureDate: string;
  pickupTime: string;
  airline: string;
}

export type CartLeg = AirportLeg | CruiseLeg | PostCruiseAirportLeg | PostCruiseHotelLeg | DepartureLeg;

export const LEG_TYPE_LABELS: Record<CartLeg["legType"], string> = {
  airport: "Airport Transfer",
  cruise: "Hotel ↔ Cruise Port Transfer",
  "post-cruise-airport": "Cruise Port → Airport",
  "post-cruise-hotel": "Cruise Port → Hotel",
  departure: "Hotel → Airport Departure",
};

/** The date/time shown on a cart-leg summary row, regardless of which fields that leg type uses. */
export function legDateTime(leg: CartLeg): { date: string; time: string } {
  switch (leg.legType) {
    case "airport":
      return { date: leg.pickupDate, time: leg.pickupTime };
    case "cruise":
      return { date: leg.cruiseDate, time: leg.departureTime };
    case "departure":
      return { date: leg.departureDate, time: leg.pickupTime };
    case "post-cruise-airport":
    case "post-cruise-hotel":
      return { date: "", time: "" };
  }
}
