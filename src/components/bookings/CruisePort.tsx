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
  adults: string;
  cruiseDate: string;
  cruiseLine: string;
  cruiseShip: string;
  departureTime: string;
  pickupLoc: string;
  dropoffLoc: string;
}

interface CruisePortProps {
  onComplete: (leg: CruiseLeg) => void;
  prefillHotel?: string;
}

export default function CruisePort({ onComplete, prefillHotel }: CruisePortProps) {
  const { groupA: propertyLocations, groupB: cruisePortLocations, isLoading: locationsLoading } = useLocations("Hotel", "Port");
  const { guestInfo, updateGuestInfo, setLastHotel, setLastCruise, lastPassengers } = useBookingCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<CruiseFormState>({
    bookingType: "CS",
    adults: lastPassengers,
    cruiseDate: "",
    cruiseLine: "",
    cruiseShip: "",
    departureTime: "",
    pickupLoc: prefillHotel ?? "",
    dropoffLoc: "",
  });
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
      const cruisePort = formData.bookingType === "CS" ? formData.dropoffLoc : formData.pickupLoc;
      setLastCruise({ cruiseLine: formData.cruiseLine, cruiseShip: formData.cruiseShip, cruisePort });
      const leg: CruiseLeg = {
        id: crypto.randomUUID(),
        legType: "cruise",
        ...formData,
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
        <div>
          <label htmlFor="cruise_port" className={labelClass}>Cruise Port</label>
          <select
            id="cruise_port"
            className={inputClass}
            value={formData.bookingType === "CS" ? formData.dropoffLoc : formData.pickupLoc}
            onChange={cruisePortHandleChange}
            required
          >
            <option value="" disabled>Select cruise port</option>
            {cruisePortLocations.map((location) => (
              <option key={location.id} value={location.locationName}>{location.locationName}</option>
            ))}
          </select>
        </div>
        <CommonDepartureTime updateFormData={updateFormData} formData={formData} />

        <div className={sectionHeaderClass}>
          <p className="text-lg">No. Passengers</p>
        </div>
        <CommonPassengers value={formData.adults} onChange={(v) => updateFormData({ adults: v })} />

        <div className={sectionHeaderClass}>
          <p className="text-lg">Pickup Location</p>
        </div>
        <div>
          <label htmlFor="pickup_location" className={labelClass}>
            {formData.bookingType === "CS" ? "Pickup Hotel" : "Drop off Hotel"}
          </label>
          <select
            id="pickup_location"
            className={inputClass}
            value={formData.bookingType === "CS" ? formData.pickupLoc : formData.dropoffLoc}
            onChange={propertyHandleChange}
            required
          >
            <option value="" disabled>Select hotel</option>
            {propertyLocations.map((location) => (
              <option key={location.id} value={location.locationName}>{location.locationName}</option>
            ))}
          </select>
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

        {message && (
          <p className="text-sm font-medium text-red-600 underline underline-offset-2">{message}</p>
        )}

        <button type="submit" className={primaryButtonClass}>Confirm Reservation</button>
      </form>
    </div>
  );
}
