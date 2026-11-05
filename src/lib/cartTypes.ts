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
  perPersonPrice: number;
  totalPrice: number;
  serviceFee: number;
}

export interface AirportLeg extends BaseLeg {
  legType: "airport";
  bookingType: "AS" | "AP";
  pickupDate: string;
  pickupTime: string;
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
}

export interface PostCruiseAirportLeg extends BaseLeg {
  legType: "post-cruise-airport";
  cruiseLine: string;
  cruiseShip: string;
  airline: string;
}

export interface PostCruiseHotelLeg extends BaseLeg {
  legType: "post-cruise-hotel";
  cruiseLine: string;
  cruiseShip: string;
}

export interface DepartureLeg extends BaseLeg {
  legType: "departure";
  departureDate: string;
  pickupTime: string;
  airline: string;
}

export type CartLeg = AirportLeg | CruiseLeg | PostCruiseAirportLeg | PostCruiseHotelLeg | DepartureLeg;

export function getLegLabel(leg: CartLeg): string {
  switch (leg.legType) {
    case "airport":
      return leg.bookingType === "AP" ? "Airport to Hotel Arrival" : "Hotel to Airport Departure";
    case "cruise":
      return leg.bookingType === "CS" ? "Hotel to Cruise Port" : "Cruise Port to Hotel";
    case "post-cruise-airport":
      return "Cruise Port to Airport";
    case "post-cruise-hotel":
      return "Cruise Port to Hotel";
    case "departure":
      return "Hotel to Airport Departure";
  }
}

export const LEG_TYPE_LABELS: Record<CartLeg["legType"], string> = {
  airport: "Airport to Hotel Arrival",
  cruise: "Hotel to Cruise Port",
  "post-cruise-airport": "Cruise Port to Airport",
  "post-cruise-hotel": "Cruise Port to Hotel",
  departure: "Hotel to Airport Departure",
};

export function legDateTime(leg: CartLeg): { date: string; time: string } {
  switch (leg.legType) {
    case "airport":
      return { date: leg.pickupDate, time: leg.pickupTime || leg.arrival };
    case "cruise":
      return { date: leg.cruiseDate, time: leg.departureTime };
    case "departure":
      return { date: leg.departureDate, time: leg.pickupTime };
    case "post-cruise-airport":
    case "post-cruise-hotel":
      return { date: "", time: "" };
  }
}
