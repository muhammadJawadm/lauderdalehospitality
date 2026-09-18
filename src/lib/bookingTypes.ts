export interface LocationDoc {
  id: string;
  locationName: string;
  locationType: string;
}

export interface BookingState {
  bookingType: "AS" | "AP" | "CS" | "CP";
  adults: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  comments: string;
  pickupDate: string;
  pickupTime: string;
  pickupLoc: string;
  dropoffLoc: string;
  transferType: string;
  perPersonPrice: number;
  totalPrice: number;
  // Airport-specific
  airline?: string;
  arrival?: string;
  flightNum?: string;
  // Cruise-specific
  cruiseDate?: string;
  cruiseShip?: string;
  returnTrip?: boolean;
}

export const BOOKING_TYPE_LABELS: Record<BookingState["bookingType"], string> = {
  AS: "Airport Shuttle",
  AP: "Airport Pickup",
  CS: "Cruise Port Transfer",
  CP: "Cruise Port Pickup",
};

export const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-300";
export const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-body";
export const sectionHeaderClass = "rounded-lg bg-primary p-4 text-white";
export const primaryButtonClass =
  "w-full rounded-lg bg-primary py-4 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60";
