import { useState } from "react";
import { inputClass, labelClass, sectionHeaderClass, primaryButtonClass } from "../../lib/bookingTypes";
import { useLocations, resolveRouteFare } from "../../lib/useLocations";
import { useBookingCart } from "../../contexts/BookingCartContext";
import type { CruiseLeg } from "../../lib/cartTypes";
import CommonDepartureTime from "./CommonDepartureTime";
import CommonCruiseLines from "./CommonCruiseLines";
import CommonPassengers from "./CommonPassengers";
import LoaderAnimation from "../LoaderAnimation";

interface CruiseFormState {
  bookingType: "CS" | "CP";
  comments: string;
  adults: string;
  cruiseDate: string;
  cruiseLine: string;
  cruiseShip: string;
  departureTime: string;
  returnTrip: boolean;
  pickupLoc: string;
  dropoffLoc: string;
}

const initialFormData: CruiseFormState = {
  bookingType: "CS",
  comments: "",
  adults: "2",
  cruiseDate: "",
  cruiseLine: "",
  cruiseShip: "",
  departureTime: "",
  returnTrip: false,
  pickupLoc: "",
  dropoffLoc: "",
};

interface CruisePortProps {
  onComplete: (leg: CruiseLeg) => void;
  /** Prefills the hotel pickup/dropoff location, e.g. the hotel just dropped off at on an earlier Airport leg. */
  prefillHotel?: string;
}

export default function CruisePort({ onComplete, prefillHotel }: CruisePortProps) {
  const { groupA: propertyLocations, groupB: cruisePortLocations, isLoading: locationsLoading } = useLocations("Hotel", "Port");
  const { guestInfo, updateGuestInfo, setLastHotel } = useBookingCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<CruiseFormState>({ ...initialFormData, pickupLoc: prefillHotel ?? "" });
  const [contact, setContact] = useState({ fName: guestInfo.fName, lName: guestInfo.lName, email: guestInfo.email, phone: guestInfo.phone });

  const updateFormData = (newData: Partial<CruiseFormState>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const cruisePortHandleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (formData.bookingType === "CS") {
      updateFormData({ dropoffLoc: e.target.value });
    } else {
      updateFormData({ pickupLoc: e.target.value });
    }
  };

  const propertyHandleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (formData.bookingType === "CS") {
      updateFormData({ pickupLoc: e.target.value });
    } else {
      updateFormData({ dropoffLoc: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      setIsSubmitting(true);
      const fare = await resolveRouteFare(formData.pickupLoc, formData.dropoffLoc, formData.adults);
      if (!fare) {
        setMessage("The chosen route is unavailable. Please select a different route.");
        return;
      }
      updateGuestInfo(contact);
      const hotel = formData.bookingType === "CS" ? formData.pickupLoc : formData.dropoffLoc;
      if (hotel) setLastHotel(hotel);
      const leg: CruiseLeg = {
        id: crypto.randomUUID(),
        legType: "cruise",
        ...formData,
        transferType: formData.returnTrip ? "Two Way" : "One Way",
        ...fare,
        serviceFee: 0,
      };
      onComplete(leg);
    } catch (error) {
      console.error("Error checking route or submitting booking:", error);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (locationsLoading || isSubmitting) return <LoaderAnimation />;

  return (
    <div className="space-y-7">
      <div className={sectionHeaderClass}>
        <p className="text-lg">Book your reservation</p>
      </div>
      <form className="space-y-7" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <p className="text-sm text-body">Select Trip Type</p>
          <div className="flex flex-wrap gap-6 sm:gap-10">
            <div className="inline-flex items-center">
              <label className="relative flex cursor-pointer items-center" htmlFor="to">
                <input
                  name="radio"
                  type="radio"
                  defaultChecked={formData.bookingType === "CS"}
                  onChange={() => updateFormData({ bookingType: "CS" })}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 transition-all checked:border-slate-400"
                  id="to"
                />
                <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
              </label>
              <label className="ml-2 cursor-pointer text-sm text-slate-600" htmlFor="to">To Cruise Port</label>
            </div>
            <div className="inline-flex items-center">
              <label className="relative flex cursor-pointer items-center" htmlFor="from">
                <input
                  name="radio"
                  type="radio"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 transition-all checked:border-slate-400"
                  id="from"
                  defaultChecked={formData.bookingType === "CP"}
                  onChange={() => updateFormData({ bookingType: "CP" })}
                />
                <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
              </label>
              <label className="ml-2 cursor-pointer text-sm text-slate-600" htmlFor="from">From Cruise Port</label>
            </div>
          </div>
        </div>

        <div className={sectionHeaderClass}>
          <p className="text-lg">Personal Information</p>
        </div>
        <div>
          <label htmlFor="first_name" className={labelClass}>First Name</label>
          <input type="text" id="first_name" className={inputClass} placeholder="John" value={contact.fName} onChange={(e) => setContact({ ...contact, fName: e.target.value })} required />
        </div>
        <div>
          <label htmlFor="last_name" className={labelClass}>Last Name</label>
          <input type="text" id="last_name" className={inputClass} placeholder="Doe" value={contact.lName} onChange={(e) => setContact({ ...contact, lName: e.target.value })} required />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input type="email" id="email" className={inputClass} placeholder="john.doe@example.com" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone #</label>
          <input type="tel" id="phone" className={inputClass} placeholder="Phone #" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} required />
        </div>
        <div>
          <label htmlFor="comments" className={labelClass}>Comments</label>
          <textarea id="comments" rows={4} className={inputClass} placeholder="Comments" value={formData.comments} onChange={(e) => updateFormData({ comments: e.target.value })} />
        </div>

        <div className={sectionHeaderClass}>
          <p className="text-lg">Cruise Details</p>
        </div>
        <div>
          <label htmlFor="date_cruise" className={labelClass}>Date of Cruise</label>
          <input type="date" id="date_cruise" className={inputClass} value={formData.cruiseDate} onChange={(e) => updateFormData({ cruiseDate: e.target.value })} required />
        </div>
        <CommonCruiseLines updateFormData={updateFormData} formData={formData} />
        <div>
          <label htmlFor="cruiseShip" className={labelClass}>Cruise Ship</label>
          <input type="text" id="cruiseShip" className={inputClass} placeholder="e.g. Icon of the Seas" value={formData.cruiseShip} onChange={(e) => updateFormData({ cruiseShip: e.target.value })} required />
        </div>
        <CommonDepartureTime updateFormData={updateFormData} formData={formData} />
        <div className="space-y-2">
          <p className="text-sm text-body">Return Trip?</p>
          <div className="flex items-center gap-2.5">
            <label className="relative flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-400 shadow transition-all hover:shadow-md checked:border-primary checked:bg-primary"
                id="check"
                checked={formData.returnTrip}
                onChange={(e) => updateFormData({ returnTrip: e.target.checked })}
              />
              <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </label>
            <p className="text-sm text-body">Include a return trip.</p>
          </div>
        </div>

        <div className={sectionHeaderClass}>
          <p className="text-lg">No. Passengers</p>
        </div>
        <CommonPassengers value={formData.adults} onChange={(v) => updateFormData({ adults: v })} />

        <div className={sectionHeaderClass}>
          <p className="text-lg">Location</p>
        </div>
        <div>
          <label htmlFor="cruise_port" className={labelClass}>Cruise Port</label>
          <select
            id="cruise_port"
            className={inputClass}
            value={formData.bookingType === "CS" ? formData.dropoffLoc : formData.pickupLoc}
            onChange={cruisePortHandleChange}
            required
          >
            <option value="" disabled>
              Select {formData.bookingType === "CS" ? "drop off" : "pickup"} cruise port
            </option>
            {cruisePortLocations.map((location) => (
              <option key={location.id} value={location.locationName}>{location.locationName}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pickup_location" className={labelClass}>
            {formData.bookingType === "CS" ? "Pickup" : "Drop off"} Location
          </label>
          <select
            id="pickup_location"
            className={inputClass}
            value={formData.bookingType === "CS" ? formData.pickupLoc : formData.dropoffLoc}
            onChange={propertyHandleChange}
            required
          >
            <option value="" disabled>
              Select {formData.bookingType === "CS" ? "pickup" : "drop off"} location
            </option>
            {propertyLocations.map((location) => (
              <option key={location.id} value={location.locationName}>{location.locationName}</option>
            ))}
          </select>
        </div>

        {message && (
          <p className="text-sm font-medium text-red-600 underline underline-offset-2">{message}</p>
        )}

        <button type="submit" className={primaryButtonClass}>Confirm Reservation</button>
      </form>
    </div>
  );
}
